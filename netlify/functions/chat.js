// Netlify Function: proxies chat requests to the Google Gemini API.
//
// The Gemini API key lives ONLY in the GEMINI_API_KEY environment variable.
// It is never sent to the browser and never included in any response body.
//
// Served at /.netlify/functions/chat — see netlify.toml for the /api/chat redirect.

// Swap to "gemini-3.5-flash" here when ready — nothing else changes.
const MODEL = "gemini-2.5-flash";
const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/" +
  MODEL +
  ":generateContent";

const MAX_MESSAGES = 30;
const MAX_MESSAGE_CHARS = 2000;

const SYSTEM_PROMPT = `You are the Resident Assistant for Francine Realty, a privately owned, full-service real estate company that has owned and managed luxury residential buildings throughout New York City for more than 40 years. The company began in Brooklyn Heights and now manages residences across NYC.

OFFICE DETAILS (share when relevant):
- Address: 53 Bay Ridge Avenue, Brooklyn, NY 11220
- Phone: 718-833-8712
- Email: Jelgart@francinerealty.com
- Office hours: Monday-Friday, 9:00 AM - 5:00 PM ET

YOUR ROLE:
Help residents with routine questions quickly and warmly. Common topics: rent and payments, lease questions, maintenance requests, building amenities, move-in/move-out, and how to reach the office.

RENT & PAYMENTS:
- Rent is due on the 1st of each month and is late after the 5th.
- For balances or to make a payment, direct residents to their resident portal or the office. You cannot view individual account balances or process payments.

MAINTENANCE - TRIAGE CAREFULLY:
- LIFE-SAFETY EMERGENCIES (gas smell, fire, building-wide power loss, flooding, anyone in danger): tell them to call 911 immediately. For a gas smell, leave the unit and call 911 or Con Edison at 1-800-752-6633. Do not troubleshoot these.
- URGENT (no heat during NYC heat season Oct 1-May 31, no hot water, major leak, broken lock, no working toilet in a one-bath unit): tell them to call the office now at 718-833-8712 for priority dispatch.
- ROUTINE (dripping faucet, appliance issue, minor repairs): collect the apartment number and a short description, then confirm you've logged the request for the maintenance team.
- For NYC heat complaints, residents may also call 311.

STYLE:
- Warm, professional, concise. Plain language, sentence case. Two to four sentences for most replies.
- Ask one clarifying question at a time when you need the apartment number or details.
- Never give legal advice. Never promise specific timelines you can't guarantee - say the team will follow up.
- Follow fair housing principles: never reference race, religion, national origin, family status, disability, or other protected classes when discussing tenancy.
- If a request is outside routine support, give the office phone, email, and hours.`;

const json = (statusCode, obj) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(obj),
});

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json", Allow: "POST" },
      body: JSON.stringify({ error: "Method not allowed." }),
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return json(500, { error: "Server is not configured. Please try again later." });
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch (e) {
    return json(400, { error: "Invalid JSON body." });
  }

  const messages = body && body.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return json(400, { error: "No messages provided." });
  }

  // Abuse protection.
  if (messages.length > MAX_MESSAGES) {
    return json(400, { error: "Conversation is too long." });
  }

  for (const m of messages) {
    if (
      !m ||
      (m.role !== "user" && m.role !== "model") ||
      typeof m.text !== "string"
    ) {
      return json(400, { error: "Malformed message." });
    }
    if (m.text.length > MAX_MESSAGE_CHARS) {
      return json(400, { error: "A message is too long." });
    }
  }

  const payload = {
    system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: messages.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    })),
    generationConfig: { temperature: 0.4, maxOutputTokens: 1000 },
  };

  try {
    const upstream = await fetch(GEMINI_ENDPOINT + "?key=" + apiKey, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => "");
      console.error("Gemini API error:", upstream.status, detail);
      return json(502, { error: "The assistant is unavailable right now." });
    }

    const data = await upstream.json();
    const parts =
      (data &&
        data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts) ||
      [];
    const reply = parts
      .map((p) => (p && p.text ? p.text : ""))
      .join("")
      .trim();

    if (!reply) {
      return json(502, { error: "The assistant did not return a response." });
    }

    return json(200, { reply });
  } catch (e) {
    console.error("Proxy error:", e);
    return json(502, { error: "The assistant is unavailable right now." });
  }
};
