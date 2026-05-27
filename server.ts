/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { 
  DbSchema, 
  DEFAULT_LEADERBOARD_PRIZES, 
  MILESTONE_REWARDS, 
  COMMISSION_TIERS 
} from "./src/types";

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "db.json");

// Middleware to parse JSON
app.use(express.json());

// Initialize database with premium realistic default data
function getInitialDbState(): DbSchema {
  const users = [
    {
      id: "user-admin",
      email: "Zaeempalace@gmail.com",
      username: "OldManNuts",
      thrillName: "OLDMAN",
      kickName: "oldmannuts",
      discordName: "oldmannuts#1337",
      xp: 2450000,
      totalXp: 4850000,
      level: 6,
      joinedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      isAdmin: true
    },
    {
      id: "user-2",
      email: "gambler123@gmail.com",
      username: "lucky777",
      thrillName: "lucky777",
      kickName: "lucky_kick",
      discordName: "lucky777#9922",
      xp: 1280000,
      totalXp: 3100000,
      level: 6,
      joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "user-3",
      email: "spinmaster@gmail.com",
      username: "slot_guru",
      thrillName: "thrill_guru",
      kickName: "slotgurutv",
      discordName: "guru#8811",
      xp: 620000,
      totalXp: 1450000,
      level: 5,
      joinedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  // Baseline leaderboard with 24 realistic users matching requested data
  const usernames = [
    "scandalous", "whynot", "shinobi", "xanadu", "huey",
    "christopher", "faith", "turbo", "nectar", "santiago",
    "raptor", "remedy", "nemesis", "steve", "active",
    "shifty", "variable", "mrrogers", "feedback", "bonnie",
    "hexor", "ch1p", "vrad", "opponent"
  ];

  const xps = [
    519524, 463508, 392821, 314942, 172937,
    126457, 99059, 93595, 89061, 78358,
    77704, 75739, 55641, 52920, 52712,
    51747, 41756, 39385, 24155, 23436,
    23216, 22426, 18573, 18541
  ]; // Every entry has rank 1 to 24.

  const leaderboard = usernames.map((uname, index) => {
    const xp = xps[index];
    const prizeConfig = DEFAULT_LEADERBOARD_PRIZES.find(p => p.rank === index + 1);
    const prize = prizeConfig ? prizeConfig.prize : 0;
    return {
      id: `lb-user-${index + 1}`,
      username: uname,
      xp,
      prize,
      rank: index + 1
    };
  });

  const promotions = [
    {
      id: "promo-1",
      title: "Sweet Bonanza 1000x Slot Hunt",
      type: "slot-hunt" as const,
      slotName: "Sweet Bonanza",
      imageIcon: "🍒",
      desc: "Hit a 1000x or greater multiplier on Sweet Bonanza. Submit your screenshot or clip ID dynamically to lock in your Papaya bonus!",
      reward: "$250 Cash Bonus + 5,000 XP Boost",
      status: "active" as const,
      targetXp: 5000,
      participantsCount: 42,
      joinedUsers: ["user-2", "user-3"],
      createdAt: new Date().toISOString()
    },
    {
      id: "promo-2",
      title: "Wanted Dead or a Wild - Duel Challenge",
      type: "challenge" as const,
      slotName: "Wanted Dead or a Wild",
      imageIcon: "🤠",
      desc: "Be the first person to hit a Full Screen of VS-Scythes in the Duel at Dawn bonus hunt. Must wager minimum $0.40.",
      reward: "$1,500 Pure Match Play Cash",
      status: "active" as const,
      targetXp: 12500,
      participantsCount: 19,
      joinedUsers: ["user-admin"],
      createdAt: new Date().toISOString()
    },
    {
      id: "promo-3",
      title: "Bi-Weekly Wager Target Milestone",
      type: "wager-race" as const,
      slotName: "All Thrill Slots",
      imageIcon: "📈",
      desc: "Wager at least $100,000 during this cycle's race to unlock direct access to premium Discord merchandise packs and premium support tiers.",
      reward: "Limited Edition OldManNuts Hoodie",
      status: "active" as const,
      targetXp: 100000,
      participantsCount: 8,
      joinedUsers: ["user-2", "user-admin"],
      createdAt: new Date().toISOString()
    }
  ];

  const raffles = [
    {
      id: "raffle-1",
      title: "$1,000 Saturday Mega Raffle",
      prize: "$1,000 Cash Split for 5 Winners ($200 each)",
      entryRequirement: "Wager $2,500 on Thrill under affiliate code OLDMAN over the last 7 days.",
      wagerRequired: 2500,
      slotsMax: 100,
      slotsFilled: 24,
      status: "active" as const,
      endAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      winners: [],
      participants: [
        { userId: "user-2", username: "lucky777" },
        { userId: "user-3", username: "slot_guru" }
      ],
      createdAt: new Date().toISOString()
    },
    {
      id: "raffle-2",
      title: "Discord Exclusive Stay Nuts Giveaway",
      prize: "Apple iPad Air or Cash Value equivalent ($600)",
      entryRequirement: "Free Entry for all active Discord Members with verified Kick accounts.",
      wagerRequired: 0,
      slotsMax: 500,
      slotsFilled: 184,
      status: "active" as const,
      endAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      winners: [],
      participants: [
        { userId: "user-admin", username: "OldManNuts" },
        { userId: "user-2", username: "lucky777" }
      ],
      createdAt: new Date().toISOString()
    }
  ];

  const payouts = [
    {
      id: "payout-1",
      userId: "user-2",
      userEmail: "gambler123@gmail.com",
      username: "lucky777",
      thrillName: "lucky777",
      amount: 460,
      period: "Milestone: Level 5 Unlock",
      status: "paid" as const,
      type: "milestone" as const,
      details: "Earned for crossing 1,250,000 legacy XP milestone total.",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "payout-2",
      userId: "user-3",
      userEmail: "spinmaster@gmail.com",
      username: "slot_guru",
      thrillName: "thrill_guru",
      amount: 248,
      period: "May 1st - May 15th 2026 Commission",
      status: "pending" as const,
      type: "commission" as const,
      details: "Calculated 40% commission rate on wager target of $620,000 Thrill volume.",
      createdAt: new Date().toISOString()
    }
  ];

  const auditLogs = [
    {
      id: "log-1",
      action: "API Key Rotated",
      timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      details: "Rotated the primary connection API Key with Thrill network. Health check response is OK.",
      adminEmail: "Zaeempalace@gmail.com"
    },
    {
      id: "log-2",
      action: "System Build Configured",
      timestamp: new Date().toISOString(),
      details: "Configured bi-weekly wager target timeframe from May 15 to May 29, 2026.",
      adminEmail: "Zaeempalace@gmail.com"
    }
  ];

  const config = {
    thrillApiKey: "thrill_live_key_9df8a3dc2e",
    keyLastRotated: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    cycleStart: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    cycleEnd: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    totalRacePrizePool: 12500
  };

  return { users, leaderboard, promotions, raffles, payouts, auditLogs, config };
}

// Read database
function readDb(): DbSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const state = getInitialDbState();
      fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), "utf8");
      return state;
    }
    const content = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(content) as DbSchema;
  } catch (err) {
    console.error("Failed to read database, resetting default", err);
    return getInitialDbState();
  }
}

// Write database
function writeDb(data: DbSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write database file:", err);
  }
}

// Setup APIs
// 1. Leaderboard API
app.get("/api/leaderboard", (req, res) => {
  const db = readDb();
  // Sort leaderboard by XP descending
  const sorted = [...db.leaderboard].sort((a, b) => b.xp - a.xp);

  // Recalculate prizes and rank in case they shifted
  const recalculated = sorted.map((entry, index) => {
    const rank = index + 1;
    const prizeConfig = DEFAULT_LEADERBOARD_PRIZES.find(p => p.rank === rank);
    const prize = prizeConfig ? prizeConfig.prize : 0; // default lower-end prizes to 0
    return {
      ...entry,
      rank,
      prize
    };
  });

  // Check if admin is requesting to prevent masking usernames
  const isAdminRequest = req.query.adminMode === "true";
  const userThrillName = (req.query.thrillName as string || "").toLowerCase();
  
  if (isAdminRequest) {
    return res.json(recalculated);
  }

  // General public gets masked usernames (first 3 letters visible + ***)
  const maskedLeaderboard = recalculated.map(entry => {
    const uname = entry.username || "anonymous";
    const isCurrentUser = userThrillName && (uname.toLowerCase() === userThrillName);
    
    let masked = uname;
    if (isCurrentUser) {
      masked = uname; // Keep unmasked for current user so they identify themselves
    } else if (uname.length > 3) {
      masked = uname.substring(0, 3) + "***";
    } else {
      masked = uname.substring(0, 1) + "**";
    }
    return {
      ...entry,
      username: masked
    };
  });

  res.json(maskedLeaderboard);
});

// Update leaderboard row (Admin Panel)
app.post("/api/leaderboard/manage", (req, res) => {
  const { username, xp } = req.body;
  if (!username) return res.status(400).json({ error: "Username is required" });

  const numericXp = Number(xp) || 0;
  const db = readDb();

  // Find if exists
  const existingIndex = db.leaderboard.findIndex(item => item.username.toLowerCase() === username.toLowerCase());

  if (existingIndex >= 0) {
    db.leaderboard[existingIndex].xp = numericXp;
  } else {
    db.leaderboard.push({
      id: `lb-manual-${Date.now()}`,
      username,
      xp: numericXp,
      prize: 0,
      rank: db.leaderboard.length + 1,
      manuallyAdded: true
    });
  }

  // Sort and list with ranks and prize structures
  db.leaderboard.sort((a, b) => b.xp - a.xp);
  db.leaderboard = db.leaderboard.map((entry, index) => {
    const rank = index + 1;
    const prizeConfig = DEFAULT_LEADERBOARD_PRIZES.find(p => p.rank === rank);
    return {
      ...entry,
      rank,
      prize: prizeConfig ? prizeConfig.prize : 0
    };
  });

  // Log action
  db.auditLogs.unshift({
    id: `log-lb-${Date.now()}`,
    action: "Leaderboard Updated",
    timestamp: new Date().toISOString(),
    details: `Updated entry for ${username} to XP: ${numericXp.toLocaleString()}`,
    adminEmail: "Zaeempalace@gmail.com"
  });

  writeDb(db);
  res.json({ success: true, leaderboard: db.leaderboard });
});

// Remove leaderboard entry
app.delete("/api/leaderboard/manage/:id", (req, res) => {
  const { id } = req.params;
  const db = readDb();
  
  const originalLength = db.leaderboard.length;
  const itemToRemove = db.leaderboard.find(item => item.id === id);
  db.leaderboard = db.leaderboard.filter(item => item.id !== id);

  if (db.leaderboard.length < originalLength && itemToRemove) {
    // Sort and re-rank
    db.leaderboard.sort((a, b) => b.xp - a.xp);
    db.leaderboard = db.leaderboard.map((entry, index) => {
      const rank = index + 1;
      const prizeConfig = DEFAULT_LEADERBOARD_PRIZES.find(p => p.rank === rank);
      return {
        ...entry,
        rank,
        prize: prizeConfig ? prizeConfig.prize : 0
      };
    });

    db.auditLogs.unshift({
      id: `log-lbremove-${Date.now()}`,
      action: "Leaderboard Entry Cleared",
      timestamp: new Date().toISOString(),
      details: `Removed player ${itemToRemove.username} from bi-weekly race`,
      adminEmail: "Zaeempalace@gmail.com"
    });

    writeDb(db);
    return res.json({ success: true, leaderboard: db.leaderboard });
  }

  res.status(404).json({ error: "Item not found" });
});


// 2. Promotions API
app.get("/api/promotions", (req, res) => {
  const db = readDb();
  res.json(db.promotions);
});

// Create/Edit/Delete Promotion (Admin)
app.post("/api/promotions", (req, res) => {
  const { id, title, type, slotName, imageIcon, desc, reward, status, targetXp } = req.body;
  if (!title || !type || !reward) {
    return res.status(400).json({ error: "Missing required fields: title, type, reward" });
  }

  const db = readDb();

  if (id) {
    // Edit action
    const idx = db.promotions.findIndex(p => p.id === id);
    if (idx >= 0) {
      db.promotions[idx] = {
        ...db.promotions[idx],
        title,
        type,
        slotName,
        imageIcon: imageIcon || "🎰",
        desc,
        reward,
        status: status || "active",
        targetXp: Number(targetXp) || undefined
      };
      db.auditLogs.unshift({
        id: `log-promo-${Date.now()}`,
        action: "Promotion Modified",
        timestamp: new Date().toISOString(),
        details: `Edited promotion: "${title}"`,
        adminEmail: "Zaeempalace@gmail.com"
      });
    } else {
      return res.status(404).json({ error: "Promotion not found" });
    }
  } else {
    // Create action
    const newPromo = {
      id: `promo-${Date.now()}`,
      title,
      type,
      slotName,
      imageIcon: imageIcon || "🎰",
      desc,
      reward,
      status: status || "active",
      targetXp: Number(targetXp) || undefined,
      participantsCount: 0,
      joinedUsers: [],
      createdAt: new Date().toISOString()
    };
    db.promotions.unshift(newPromo);

    db.auditLogs.unshift({
      id: `log-promo-${Date.now()}`,
      action: "Promotion Appended",
      timestamp: new Date().toISOString(),
      details: `Created new promotion: "${title}"`,
      adminEmail: "Zaeempalace@gmail.com"
    });
  }

  writeDb(db);
  res.json({ success: true, promotions: db.promotions });
});

app.delete("/api/promotions/:id", (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const originalLength = db.promotions.length;
  const promo = db.promotions.find(p => p.id === id);
  db.promotions = db.promotions.filter(p => p.id !== id);

  if (db.promotions.length < originalLength && promo) {
    db.auditLogs.unshift({
      id: `log-promo-del-${Date.now()}`,
      action: "Promotion Trashed",
      timestamp: new Date().toISOString(),
      details: `Deleted promotion: "${promo.title}"`,
      adminEmail: "Zaeempalace@gmail.com"
    });
    writeDb(db);
    return res.json({ success: true, promotions: db.promotions });
  }
  res.status(404).json({ error: "Promotion not found" });
});

// Join active promotion
app.post("/api/promotions/:id/join", (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "User ID is required" });

  const db = readDb();
  const promo = db.promotions.find(p => p.id === id);
  if (!promo) return res.status(404).json({ error: "Promotion not found" });

  if (promo.joinedUsers.includes(userId)) {
    return res.json({ success: true, message: "User already joined", promotions: db.promotions });
  }

  promo.joinedUsers.push(userId);
  promo.participantsCount = promo.joinedUsers.length;

  writeDb(db);
  res.json({ success: true, promotions: db.promotions });
});


// 3. Raffles API
app.get("/api/raffles", (req, res) => {
  const db = readDb();
  res.json(db.raffles);
});

// Create/Edit/Delete Raffle (Admin)
app.post("/api/raffles", (req, res) => {
  const { id, title, prize, entryRequirement, wagerRequired, slotsMax, status, endAt } = req.body;
  if (!title || !prize) return res.status(400).json({ error: "Missing title or prize" });

  const db = readDb();

  if (id) {
    const idx = db.raffles.findIndex(r => r.id === id);
    if (idx >= 0) {
      db.raffles[idx] = {
        ...db.raffles[idx],
        title,
        prize,
        entryRequirement: entryRequirement || "Wager during dynamic cycle",
        wagerRequired: Number(wagerRequired) || 0,
        slotsMax: Number(slotsMax) || 100,
        status: status || "active",
        endAt: endAt || db.raffles[idx].endAt
      };
      db.auditLogs.unshift({
        id: `log-raffle-${Date.now()}`,
        action: "Raffle Configuration Modified",
        timestamp: new Date().toISOString(),
        details: `Edited raffle: "${title}"`,
        adminEmail: "Zaeempalace@gmail.com"
      });
    }
  } else {
    db.raffles.unshift({
      id: `raffle-${Date.now()}`,
      title,
      prize,
      entryRequirement: entryRequirement || "Wager during dynamic cycle",
      wagerRequired: Number(wagerRequired) || 0,
      slotsMax: Number(slotsMax) || 100,
      slotsFilled: 0,
      status: "active",
      endAt: endAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      winners: [],
      participants: [],
      createdAt: new Date().toISOString()
    });
    db.auditLogs.unshift({
      id: `log-raffle-${Date.now()}`,
      action: "New Raffle Scheduled",
      timestamp: new Date().toISOString(),
      details: `Scheduled raffle: "${title}"`,
      adminEmail: "Zaeempalace@gmail.com"
    });
  }

  writeDb(db);
  res.json({ success: true, raffles: db.raffles });
});

// Join raffle
app.post("/api/raffles/:id/join", (req, res) => {
  const { id } = req.params;
  const { userId, username } = req.body;

  if (!userId || !username) {
    return res.status(400).json({ error: "User info required" });
  }

  const db = readDb();
  const raffle = db.raffles.find(r => r.id === id);
  if (!raffle) return res.status(404).json({ error: "Raffle not found" });

  if (raffle.participants.some(p => p.userId === userId)) {
    return res.status(400).json({ error: "Already entered in this raffle" });
  }

  // Check XP qualification
  const user = db.users.find(u => u.id === userId);
  if (user && user.xp < raffle.wagerRequired) {
    return res.status(400).json({ 
      error: `Insufficient XP. You wagered $${user.xp.toLocaleString()}, but this raffle requires $${raffle.wagerRequired.toLocaleString()} wagered.` 
    });
  }

  if (raffle.slotsFilled >= raffle.slotsMax) {
    return res.status(400).json({ error: "This raffle is full!" });
  }

  raffle.participants.push({ userId, username });
  raffle.slotsFilled = raffle.participants.length;

  writeDb(db);
  res.json({ success: true, raffles: db.raffles });
});

// Admin Draw Raffle
app.post("/api/raffles/:id/draw", (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const raffle = db.raffles.find(r => r.id === id);
  if (!raffle) return res.status(404).json({ error: "Raffle not found" });

  if (raffle.participants.length === 0) {
    return res.status(400).json({ error: "No players registered in raffle to draw from." });
  }

  // Choose random winners (typically 1 to 3 winners depending on size, let's select 2 or 1)
  const drawCount = Math.min(raffle.participants.length, 3);
  const shuffled = [...raffle.participants].sort(() => 0.5 - Math.random());
  const selectedWinners = shuffled.slice(0, drawCount).map(p => p.username);

  raffle.winners = selectedWinners;
  raffle.status = "drawn";

  db.auditLogs.unshift({
    id: `log-raff-${Date.now()}`,
    action: "Raffle Winners Drawn",
    timestamp: new Date().toISOString(),
    details: `Drew ${selectedWinners.join(", ")} as winners of "${raffle.title}"`,
    adminEmail: "Zaeempalace@gmail.com"
  });

  writeDb(db);
  res.json({ success: true, raffles: db.raffles });
});

app.delete("/api/raffles/:id", (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const originalLength = db.raffles.length;
  const raffle = db.raffles.find(r => r.id === id);
  db.raffles = db.raffles.filter(r => r.id !== id);

  if (db.raffles.length < originalLength && raffle) {
    db.auditLogs.unshift({
      id: `log-raffle-del-${Date.now()}`,
      action: "Raffle Cancelled",
      timestamp: new Date().toISOString(),
      details: `Cancelled and deleted raffle: "${raffle.title}"`,
      adminEmail: "Zaeempalace@gmail.com"
    });
    writeDb(db);
    return res.json({ success: true, raffles: db.raffles });
  }
  res.status(404).json({ error: "Raffle not found" });
});


// 4. Payouts API (Commission and milestones)
app.get("/api/payouts", (req, res) => {
  const db = readDb();
  res.json(db.payouts);
});

// Create payout claim
app.post("/api/payouts/claim", (req, res) => {
  const { userId, type, milestoneThreshold, commissionWagered } = req.body;
  if (!userId || !type) return res.status(400).json({ error: "Missing required details" });

  const db = readDb();
  const user = db.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  let amount = 0;
  let periodDetails = "";
  let detailsText = "";

  if (type === "milestone") {
    const ml = MILESTONE_REWARDS.find(m => m.threshold === milestoneThreshold);
    if (!ml) return res.status(400).json({ error: "Invalid milestone reward tier" });
    
    // Check if player has the legacy total XP
    if (user.totalXp < milestoneThreshold) {
      return res.status(400).json({ 
        error: `Requires $${milestoneThreshold.toLocaleString()} total wagered. Yours is $${user.totalXp.toLocaleString()}` 
      });
    }

    // Verify hasn't already claimed it
    const alreadyClaimed = db.payouts.some(p => p.userId === userId && p.type === "milestone" && p.amount === ml.prize);
    if (alreadyClaimed) {
      return res.status(400).json({ error: "You already claimed this milestone reward!" });
    }

    amount = ml.prize;
    periodDetails = `Milestone: Level Up Bonus $${ml.prize}`;
    detailsText = `Claimed cash milestone reward for reaching $${milestoneThreshold.toLocaleString()} lifetime wagers!`;

  } else if (type === "commission") {
    // Determine the tier based on xp wagered in the current cycle
    const qualifiedTier = [...COMMISSION_TIERS]
      .reverse()
      .find(t => user.xp >= t.threshold);

    if (!qualifiedTier) {
      return res.status(400).json({ 
        error: `Insufficient wager volume to claim commission. Minimum $25,000 required, you have wagered $${user.xp.toLocaleString()}` 
      });
    }

    // Period is bi-weekly frame
    periodDetails = `${db.config.cycleStart} to ${db.config.cycleEnd} Commission Pay`;
    
    // Check if already claimed for this frame
    const alreadyClaimed = db.payouts.some(p => p.userId === userId && p.type === "commission" && p.period === periodDetails);
    if (alreadyClaimed) {
      return res.status(400).json({ error: "You already claimed commission for the current bi-weekly cycle!" });
    }

    // Let's compute payout as a placeholder: total XP / 1000 * rate / 100
    // e.g. 100k wagered * 50% rate = $50 commission (simulating the payout calculation logic)
    amount = Math.round((user.xp / 1000) * (qualifiedTier.rate / 100));
    detailsText = `Calculated ${qualifiedTier.rate}% commission tier payout based on cyclical wagers of $${user.xp.toLocaleString()}`;
  }

  // Create Payout structure
  const pId = `payout-${Date.now()}`;
  const newPayout = {
    id: pId,
    userId: user.id,
    userEmail: user.email,
    username: user.username,
    thrillName: user.thrillName || "Unlinked",
    amount,
    period: periodDetails,
    status: "pending" as const,
    type: type as "milestone" | "commission",
    details: detailsText,
    createdAt: new Date().toISOString()
  };

  db.payouts.unshift(newPayout);
  writeDb(db);

  res.json({ success: true, payout: newPayout, payouts: db.payouts });
});

// For Admin: approve/update payout status
app.post("/api/payouts/status", (req, res) => {
  const { id, status } = req.body;
  if (!id || !status) return res.status(400).json({ error: "ID and status required" });

  const db = readDb();
  const index = db.payouts.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: "Payout transaction not found" });

  db.payouts[index].status = status;

  db.auditLogs.unshift({
    id: `log-payout-${Date.now()}`,
    action: `Payout status updated to: ${status}`,
    timestamp: new Date().toISOString(),
    details: `Updated payroll transaction ID ${id} for user ${db.payouts[index].username} (amount: $${db.payouts[index].amount})`,
    adminEmail: "Zaeempalace@gmail.com"
  });

  writeDb(db);
  res.json({ success: true, payouts: db.payouts });
});


// 5. System Configuration / Key Rotation API
app.get("/api/config", (req, res) => {
  const db = readDb();
  res.json(db.config);
});

app.post("/api/config", (req, res) => {
  const { thrillApiKey, cycleStart, cycleEnd, totalRacePrizePool } = req.body;
  const db = readDb();

  let detailsText = "Updated system configuration: ";

  if (thrillApiKey && thrillApiKey !== db.config.thrillApiKey) {
    db.config.thrillApiKey = thrillApiKey;
    db.config.keyLastRotated = new Date().toISOString();
    detailsText += "Rotated Thrill Casino API credentials. ";
  }

  if (cycleStart) {
    db.config.cycleStart = cycleStart;
    detailsText += `Wager run start: ${cycleStart}. `;
  }

  if (cycleEnd) {
    db.config.cycleEnd = cycleEnd;
    detailsText += `Wager run end: ${cycleEnd}. `;
  }

  if (totalRacePrizePool) {
    db.config.totalRacePrizePool = Number(totalRacePrizePool) || 12500;
    detailsText += `Adjusted total prize budget to $${db.config.totalRacePrizePool.toLocaleString()}. `;
  }

  db.auditLogs.unshift({
    id: `log-config-${Date.now()}`,
    action: "System Settings Altered",
    timestamp: new Date().toISOString(),
    details: detailsText,
    adminEmail: "Zaeempalace@gmail.com"
  });

  writeDb(db);
  res.json({ success: true, config: db.config });
});

// 6. Audit Logs API
app.get("/api/audit-logs", (req, res) => {
  const db = readDb();
  res.json(db.auditLogs);
});


// 7. Users API (Admin User Management and Manual Admin State Manipulation)
app.get("/api/users", (req, res) => {
  const db = readDb();
  res.json(db.users);
});

// Update/Modify user data manually from Admin management
app.post("/api/users/update", (req, res) => {
  const { id, username, thrillName, kickName, discordName, xp, totalXp, level, isAdmin } = req.body;
  if (!id) return res.status(400).json({ error: "User identity required" });

  const db = readDb();
  const idx = db.users.findIndex(u => u.id === id);
  if (idx === -1) return res.status(404).json({ error: "User record not found" });

  const oldUser = db.users[idx];

  db.users[idx] = {
    ...db.users[idx],
    username: username || oldUser.username,
    thrillName: thrillName !== undefined ? thrillName : oldUser.thrillName,
    kickName: kickName !== undefined ? kickName : oldUser.kickName,
    discordName: discordName !== undefined ? discordName : oldUser.discordName,
    xp: xp !== undefined ? Number(xp) : oldUser.xp,
    totalXp: totalXp !== undefined ? Number(totalXp) : oldUser.totalXp,
    level: level !== undefined ? Number(level) : oldUser.level,
    isAdmin: isAdmin !== undefined ? Boolean(isAdmin) : oldUser.isAdmin
  };

  db.auditLogs.unshift({
    id: `log-user-${Date.now()}`,
    action: "User Record Adjusted",
    timestamp: new Date().toISOString(),
    details: `Manually updated credentials/balances of ${oldUser.username} (${oldUser.email}).`,
    adminEmail: "Zaeempalace@gmail.com"
  });

  writeDb(db);
  res.json({ success: true, users: db.users });
});


// 8. Auth Endpoints (Register/Login)
app.post("/api/auth/register", (req, res) => {
  const { email, username, password, thrillName, kickName, discordName } = req.body;
  
  if (!email || !username || !password) {
    return res.status(400).json({ error: "Required: Email, Username, Password" });
  }

  const db = readDb();

  // Check unique constraints
  if (db.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ error: "An account with this email address already is registered." });
  }

  if (db.users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
    return res.status(400).json({ error: "Username is already taken." });
  }

  // Determine if this user is our default Admin based on Email
  const isAdmin = email.toLowerCase() === "zaeempalace@gmail.com";

  const newUser = {
    id: `user-${Date.now()}`,
    email,
    username,
    thrillName: thrillName || "",
    kickName: kickName || "",
    discordName: discordName || "",
    xp: 0, // starts at zero cycle wagered
    totalXp: 0, // starts at zero lifetime wagers
    level: 1, // calculated level
    joinedAt: new Date().toISOString(),
    isAdmin
  };

  db.users.push(newUser);
  writeDb(db);

  res.json({ success: true, user: newUser });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const db = readDb();
  // Find in userlist
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ error: "Invalid email credentials. Try registering a new account." });
  }

  res.json({ success: true, user });
});


// Start server wrapped to support async Vite middleware loader on CJS compilation target
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    
    // Custom routing for public assets so uploaded pngs work perfectly in production node builds too
    app.use(express.static(process.cwd()));

    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[OK] Old Man Nuts full-stack server running on http://localhost:${PORT}`);
  });
}

startServer();
