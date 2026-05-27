/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Coins, 
  Award, 
  Settings, 
  Clock, 
  Save, 
  CheckCircle2, 
  TrendingUp, 
  ChevronRight,
  ShieldAlert,
  Calendar
} from 'lucide-react';
import { User, COMMISSION_TIERS, MILESTONE_REWARDS } from '../types';

interface AccountTabProps {
  user: User;
  onUpdateProfile: (data: Partial<User>) => Promise<void>;
  onClaimReward: (type: 'milestone' | 'commission') => Promise<void>;
  loadingClaim: string | null;
  payouts: any[];
}

export default function AccountTab({ 
  user, 
  onUpdateProfile, 
  onClaimReward, 
  loadingClaim, 
  payouts 
}: AccountTabProps) {
  const [thrillName, setThrillName] = useState(user.thrillName || '');
  const [kickName, setKickName] = useState(user.kickName || '');
  const [discordName, setDiscordName] = useState(user.discordName || '');
  
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errText, setErrText] = useState<string | null>(null);

  const [claimSuccess, setClaimSuccess] = useState<string | null>(null);
  const [claimError, setClaimError] = useState<string | null>(null);

  // Filter user's payouts
  const myPayouts = payouts.filter(p => p.userId === user.id);

  // Check commission viability
  const qualifiedTier = [...COMMISSION_TIERS]
    .reverse()
    .find(t => user.xp >= t.threshold);

  const estimatedCommission = qualifiedTier 
    ? Math.round((user.xp / 1000) * (qualifiedTier.rate / 100))
    : 0;

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thrillName.trim()) {
      setErrText("Thrill Casino username connection is compulsory to track wagers!");
      return;
    }

    try {
      setErrText(null);
      await onUpdateProfile({ thrillName, kickName, discordName });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err: any) {
      setErrText(err.message || "Failed to update connection records.");
    }
  };

  const handleClaimCommission = async () => {
    try {
      setClaimError(null);
      await onClaimReward('commission');
      setClaimSuccess("Commission payout request registered! Approval usually takes less than 24 hours.");
      setTimeout(() => setClaimSuccess(null), 5000);
    } catch (err: any) {
      setClaimError(err.message || "Failed to register commission payroll claim.");
      setTimeout(() => setClaimError(null), 4000);
    }
  };

  const formatDate = (isoStr: string) => {
    return new Date(isoStr).toLocaleDateString();
  };

  return (
    <div className="space-y-10 pb-16 animate-fade-in font-sans text-xs">
      
      {/* Account Info Cover Banner */}
      <section className="bg-gradient-to-r from-obsidian to-obsidian-light border border-obsidian-light p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row items-center gap-6 justify-between relative shadow-xl">
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-papaya/5 blur-[50px] pointer-events-none" />
        
        <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row z-10">
          <div className="h-16 w-16 rounded-full bg-papaya/10 border border-papaya text-papaya flex items-center justify-center font-bold text-xl uppercase shadow-md shadow-papaya/10">
            {user.username.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-sans text-white flex items-center gap-2 justify-center md:justify-start">
              {user.username}
              <span className="text-[10px] font-mono text-text-secondary bg-obsidian-dark px-2 py-0.5 rounded tracking-widest border border-obsidian-light uppercase">
                {user.isAdmin ? 'STAFF OVERLORD' : 'GOLD MEMBER'}
              </span>
            </h1>
            <p className="text-text-secondary text-xs mt-1">
              Registered email address: <strong className="text-chalk">{user.email}</strong> • Member since {formatDate(user.joinedAt)}
            </p>
          </div>
        </div>

        <div className="flex gap-4 shrink-0 font-mono text-xs z-10 w-full md:w-auto justify-center md:justify-end">
          <div className="bg-obsidian-dark border border-obsidian-light/50 px-4 py-2 rounded text-center">
            <span className="text-[9px] text-text-secondary block font-bold mb-0.5">VIP LEVEL</span>
            <span className="text-papaya font-bold text-sm">LEVEL {user.level}</span>
          </div>
          <div className="bg-obsidian-dark border border-obsidian-light/50 px-4 py-2 rounded text-center">
            <span className="text-[9px] text-text-secondary block font-bold mb-0.5">CURRENT XP</span>
            <span className="text-green-400 font-bold text-sm">${user.xp.toLocaleString()}</span>
          </div>
        </div>
      </section>

      {/* Main split: Account linking & Commission Claim */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Verification Settings Card */}
        <div className="bg-obsidian border border-obsidian-light p-5 sm:p-6 rounded-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-obsidian-light pb-2.5">
            <Settings size={16} className="text-papaya" />
            <h2 className="font-silkscreen text-white text-xs sm:text-sm uppercase tracking-wider">
              Verify Connection Accounts
            </h2>
          </div>
          
          <p className="text-text-secondary text-xs leading-relaxed">
            Verify the gaming names we pull statistics from. We compile wager metrics hourly directly from Thrill casinos. <strong>Links are compulsory to credit you on general prize rosters!</strong>
          </p>

          <form onSubmit={handleProfileSave} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-text-secondary block uppercase">Thrill Casino Name (Wager ID)</label>
              <input
                type="text"
                placeholder="Linked account ID on thrill (e.g. VIP_777)"
                value={thrillName}
                onChange={(e) => setThrillName(e.target.value)}
                required
                className="bg-obsidian-dark border border-obsidian-light text-chalk text-xs rounded-md px-3.5 py-2 w-full focus:outline-none focus:border-papaya transition-all font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-text-secondary block uppercase">Kick Username (Live Streams)</label>
              <input
                type="text"
                placeholder="Kick stream handle (e.g. lucky_guy)"
                value={kickName}
                onChange={(e) => setKickName(e.target.value)}
                className="bg-obsidian-dark border border-obsidian-light text-chalk text-xs rounded-md px-3.5 py-2 w-full focus:outline-none focus:border-papaya transition-all font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-text-secondary block uppercase">Discord ID Tag (Support)</label>
              <input
                type="text"
                placeholder="Discord user tag (e.g. support#1234)"
                value={discordName}
                onChange={(e) => setDiscordName(e.target.value)}
                className="bg-obsidian-dark border border-obsidian-light text-chalk text-xs rounded-md px-3.5 py-2 w-full focus:outline-none focus:border-papaya transition-all font-mono"
              />
            </div>

            {saveSuccess && (
              <div className="bg-green-500/15 border border-green-500/35 text-green-400 p-3 rounded font-mono flex items-center justify-center gap-1.5 shadow-sm">
                <CheckCircle2 size={14} /> Verification connections updated successfully!
              </div>
            )}

            {errText && (
              <div className="bg-marsala/10 border border-marsala/30 text-red-400 p-3 rounded font-mono">
                {errText}
              </div>
            )}

            <button
              id="verify-connections-save-btn"
              type="submit"
              className="bg-papaya hover:bg-orange-500 text-obsidian font-bold py-2 px-5 rounded text-xs uppercase flex items-center gap-1.5 justify-center w-full sm:w-auto transition-colors font-sans shadow"
            >
              <Save size={14} /> Save Verifications
            </button>
          </form>
        </div>

        {/* Claiming Commissions / Milestones Card */}
        <div className="bg-obsidian border border-obsidian-light p-5 sm:p-6 rounded-xl flex flex-col justify-between gap-5">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-obsidian-light pb-2.5">
              <Coins size={16} className="text-green-400" />
              <h2 className="font-silkscreen text-white text-xs sm:text-sm uppercase tracking-wider">
                Claim Bi-Weekly Commissions
              </h2>
            </div>
            
            <p className="text-text-secondary text-xs leading-relaxed">
              Based on your cycle volume of <strong className="text-chalk">${user.xp.toLocaleString()} XP</strong> wagers. Rates reset on bi-weeklypayroll cut-offs, with direct settlement payouts.
            </p>

            {qualifiedTier ? (
              <div className="bg-obsidian-dark border border-obsidian-light p-4 rounded-xl space-y-3 font-mono">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-secondary text-[10px] uppercase">Qualified Rate Tier</span>
                  <span className="text-green-400 font-sans font-bold text-sm">{qualifiedTier.rate}% Commission</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-secondary text-[10px] uppercase">Cash Paycheck Value</span>
                  <strong className="text-papaya font-sans text-base">${estimatedCommission.toLocaleString()}</strong>
                </div>
                <div className="text-[10px] text-text-secondary">
                  Calculated from: <span className="text-chalk">(${user.xp.toLocaleString()} XP / 1000) * {qualifiedTier.rate}%</span>
                </div>
              </div>
            ) : (
              <div className="bg-obsidian-dark border border-obsidian-light p-4 rounded-xl flex items-start gap-2.5">
                <ShieldAlert size={16} className="text-papaya shrink-0 mt-0.5" />
                <p className="text-text-secondary text-[11px] leading-relaxed font-mono">
                  No commissions currently unlocked. You must wager at least <strong className="text-chalk">$25,000 Volume</strong> under code OLDMAN on Thrill over the current cycle to qualify (tier rates start at 30%).
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3 pt-2">
            {claimSuccess && (
              <div className="bg-green-500/15 border border-green-500/45 text-green-400 p-3 rounded font-mono shadow-sm">
                {claimSuccess}
              </div>
            )}

            {claimError && (
              <div className="bg-marsala/10 border border-marsala/40 text-red-400 p-3 rounded font-mono">
                {claimError}
              </div>
            )}

            {qualifiedTier ? (
              <button
                id="claim-earnings-commission-btn"
                onClick={handleClaimCommission}
                disabled={loadingClaim === 'commission' || user.xp < 25000}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-500 text-white font-bold py-2.5 rounded text-xs uppercase shadow tracking-wider transition-all hover:shadow-green-500/10"
              >
                {loadingClaim === 'commission' ? 'PROBING METRICS API...' : `Claim $${estimatedCommission.toLocaleString()} Cash Commission`}
              </button>
            ) : (
              <button
                disabled
                className="w-full bg-obsidian-dark text-text-secondary border border-obsidian-light text-xs py-2.5 rounded font-bold uppercase cursor-not-allowed font-mono"
              >
                Claim Disabled (XP Too Low)
              </button>
            )}
          </div>
        </div>

      </section>

      {/* Payout Claims History */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-text-secondary" />
          <h2 className="font-silkscreen text-white text-xs tracking-widest uppercase">
            💸 YOUR REWARDS & COMMISSION payroll RECORDS ({myPayouts.length})
          </h2>
        </div>

        {myPayouts.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-obsidian-light bg-obsidian font-mono">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-obsidian-dark/65 border-b border-obsidian-light uppercase text-[10px] text-text-secondary">
                  <th className="py-3 px-4">Period / Run</th>
                  <th className="py-3 px-4">Claim Type</th>
                  <th className="py-3 px-4 text-right">Settlement</th>
                  <th className="py-3 px-4 text-center">Payment Status</th>
                  <th className="py-3 px-4 pr-6">Rejection / Details reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-obsidian-light/40">
                {myPayouts.map((pay) => (
                  <tr key={pay.id} className="hover:bg-obsidian-dark/20 transition-colors text-xs">
                    <td className="py-3.5 px-4 font-bold text-chalk">
                      {pay.period}
                    </td>
                    <td className="py-3.5 px-4 font-sans text-text-secondary">
                      {pay.type === 'milestone' ? (
                        <span className="text-papaya font-bold bg-papaya/10 border border-papaya/30 px-1.5 py-0.5 rounded text-[10px] uppercase">Milestone</span>
                      ) : (
                        <span className="text-green-400 font-bold bg-green-500/10 border border-green-500/30 px-1.5 py-0.5 rounded text-[10px] uppercase">Commission</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right font-sans font-bold text-green-450 text-sm">
                      ${pay.amount}
                    </td>
                    <td className="py-3.5 px-4 text-center font-sans font-extrabold">
                      {pay.status === 'pending' ? (
                        <span className="text-orange-400 bg-papaya/10 border border-papaya/30 px-2 py-0.5 rounded text-[10px] uppercase font-bold text-shadow">Pending Verification</span>
                      ) : pay.status === 'approved' ? (
                        <span className="text-blue-400 bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 rounded text-[10px] uppercase font-bold">Approved</span>
                      ) : (
                        <span className="text-green-400 bg-green-500/10 border border-green-500/30 px-2 py-0.5 rounded text-[10px] uppercase font-bold">Transferred / Paid</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-text-secondary truncate max-w-sm text-[11px] pr-6">
                      {pay.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-obsidian rounded-xl border border-obsidian-light/60 p-8 text-center text-xs text-text-secondary font-mono">
            No recent payroll requests generated on this registered account yet. Join wager races or level up above to generate.
          </div>
        )}
      </section>

    </div>
  );
}
