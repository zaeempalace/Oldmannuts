/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Target, 
  Coins, 
  Award, 
  ArrowRight, 
  Calculator, 
  Sparkles, 
  Check, 
  Clock, 
  BadgeHelp,
  AlertCircle
} from 'lucide-react';
import { User, MILESTONE_REWARDS, COMMISSION_TIERS } from '../types';

interface WagerTargetTabProps {
  user: User | null;
  onClaimReward: (type: 'milestone' | 'commission', threshold?: number) => Promise<void>;
  loadingClaim: string | null;
  payouts: any[];
}

export default function WagerTargetTab({ user, onClaimReward, loadingClaim, payouts }: WagerTargetTabProps) {
  const [calcWager, setCalcWager] = useState(user ? (user.xp || 50000) : 100000);
  const [calcClaimSuccess, setCalcClaimSuccess] = useState<string | null>(null);
  const [calcClaimError, setCalcClaimError] = useState<string | null>(null);

  // Math for calculator
  const calculateCommissionResult = (wager: number) => {
    const qualifiedTier = [...COMMISSION_TIERS]
      .reverse()
      .find(t => wager >= t.threshold);

    const rate = qualifiedTier ? qualifiedTier.rate : 0;
    // Estimated commission in cash: wager / 1000 * rate / 100 (simulated payout algorithm)
    const estimatedPayout = Math.round((wager / 1000) * (rate / 100));

    // Determine level based on legacy milestones
    const unlockedMilestone = [...MILESTONE_REWARDS]
      .reverse()
      .find(m => wager >= m.threshold);

    const level = unlockedMilestone 
      ? MILESTONE_REWARDS.indexOf(unlockedMilestone) + 1 
      : 0;

    const nextMilestone = MILESTONE_REWARDS.find(m => wager < m.threshold);

    return { rate, estimatedPayout, level, nextMilestone };
  };

  const { rate, estimatedPayout, level, nextMilestone } = calculateCommissionResult(calcWager);

  const getMyMilestoneClaimStatus = (threshold: number) => {
    if (!user) return 'locked';
    if (user.totalXp < threshold) return 'locked';
    
    // Check if payout exists for this milestone amount as approved/paid/pending
    const claimedReward = MILESTONE_REWARDS.find(r => r.threshold === threshold);
    if (!claimedReward) return 'locked';
    
    const matchedPayout = payouts.find(p => p.userId === user.id && p.type === 'milestone' && p.amount === claimedReward.prize);
    if (matchedPayout) {
      return matchedPayout.status; // 'pending' | 'approved' | 'paid'
    }
    
    return 'claimable';
  };

  const handleClaim = async (threshold: number) => {
    if (!user) {
      setCalcClaimError("You must sign in or create an account to claim custom VIP rewards.");
      return;
    }
    
    try {
      setCalcClaimError(null);
      await onClaimReward('milestone', threshold);
      setCalcClaimSuccess(`Claims request for level milestone submitted. Checks are processed every Friday!`);
      setTimeout(() => setCalcClaimSuccess(null), 5000);
    } catch (err: any) {
      setCalcClaimError(err.message || "Failed to submit claim request.");
      setTimeout(() => setCalcClaimError(null), 5000);
    }
  };

  return (
    <div className="space-y-12 pb-16 animate-fade-in font-sans">
      
      {/* Target header container */}
      <div className="bg-gradient-to-r from-obsidian via-obsidian-light to-obsidian border border-obsidian-light p-6 rounded-2xl relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-papaya/10 blur-[80px] pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10 text-center lg:text-left">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-papaya/15 text-papaya border border-papaya/30 text-xs px-3 py-1 rounded font-bold font-mono">
              <Target size={14} className="animate-spin" /> LEVEL UP MILTI-TIER SYSTEMS
            </div>
            <h1 className="font-silkscreen text-2xl sm:text-3.5xl text-white tracking-wide uppercase">
              REWARDS PROGRAM TIER REGISTRY
            </h1>
            <p className="text-text-secondary text-xs sm:text-sm max-w-xl">
              Our unique affiliate system pays you twice! Unlock massive cumulative cash bonuses on hit milestone targets AND earn up to <span className="text-green-400 font-bold">75% bi-weekly commission</span> payouts.
            </p>
          </div>

          <div className="bg-obsidian-dark border border-obsidian-light p-4 rounded-xl text-center shrink-0 w-full lg:w-auto font-mono text-xs text-text-secondary">
            <span>Bi-weekly payroll periods: </span>
            <strong className="text-papaya font-sans">1st & 15th</strong> of each cycle.
          </div>
        </div>
      </div>

      {calcClaimSuccess && (
        <div className="bg-green-500/10 border border-green-500/40 text-green-400 p-4 rounded-xl flex items-center gap-3 text-xs font-mono">
          <Check size={16} />
          <span>{calcClaimSuccess}</span>
        </div>
      )}

      {calcClaimError && (
        <div className="bg-marsala/10 border border-marsala/40 text-red-400 p-4 rounded-xl flex items-center gap-3 text-xs font-mono">
          <AlertCircle size={16} />
          <span>{calcClaimError}</span>
        </div>
      )}

      {/* Main Stats Panel for current user if logged in */}
      {user && (
        <section className="bg-obsidian border border-obsidian-light p-5 sm:p-6 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-text-secondary block">YOUR CURRENT LIFETIME XP</span>
            <strong className="text-chalk text-2xl font-mono">${user.totalXp.toLocaleString()} XP</strong>
            <span className="text-[10px] font-mono text-text-secondary block">Non-decaying total wager volume</span>
          </div>
          
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-text-secondary block">CURRENT CYCLE VOLUME</span>
            <strong className="text-papaya text-2xl font-mono">${user.xp.toLocaleString()} XP</strong>
            <span className="text-[10px] font-mono text-text-secondary block">Resets on bi-weekly payroll dates</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono text-text-secondary block">QUALIFIED VIP LEVEL</span>
            <strong className="text-green-400 text-2xl font-silkscreen block">
              VIP LEVEL {MILESTONE_REWARDS.filter(m => user.totalXp >= m.threshold).length}
            </strong>
            <span className="text-[10px] font-mono text-text-secondary block">Calculated from life XP</span>
          </div>
        </section>
      )}

      {/* Program 1: Milestone Level payouts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Table representation */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Award size={18} className="text-papaya" />
            <h2 className="font-silkscreen text-white text-sm sm:text-base tracking-wider">
              § LEVEL UP CASH MILESTONES
            </h2>
          </div>
          <p className="text-text-secondary text-xs">
            Progress is strictly client-cumulative. Hit these milestone totals to trigger direct payments. Level bonuses can only be claimed once.
          </p>

          <div className="overflow-hidden rounded-xl border border-obsidian-light bg-obsidian text-xs font-mono">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-obsidian-dark/65 text-[10px] text-text-secondary border-b border-obsidian-light uppercase">
                  <th className="py-3 px-4">Threshold XP</th>
                  <th className="py-3 px-4">Cash Bonus</th>
                  <th className="py-3 px-4 text-center">Your Request</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-obsidian-light/40">
                {MILESTONE_REWARDS.map((milestone) => {
                  const claimStatus = getMyMilestoneClaimStatus(milestone.threshold);
                  
                  return (
                    <tr key={milestone.threshold} className="hover:bg-obsidian-dark/25 transition-colors">
                      <td className="py-3 px-4 font-bold text-chalk">
                        ${(milestone.threshold / 1000).toLocaleString()}k XP
                      </td>
                      <td className="py-3 px-4 text-green-400 font-extrabold font-sans">
                        +${milestone.prize} <span className="text-text-secondary text-[10px] font-mono ml-1">(${milestone.cumulative} cumulative)</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {claimStatus === 'locked' ? (
                          <span className="text-[10px] text-text-secondary bg-obsidian-dark/30 border border-obsidian-light/20 px-2 py-0.5 rounded">
                            Locked
                          </span>
                        ) : claimStatus === 'claimable' ? (
                          <button
                            id={`claim-btn-${milestone.threshold}`}
                            onClick={() => handleClaim(milestone.threshold)}
                            disabled={loadingClaim === `milestone-${milestone.threshold}`}
                            className="text-[10px] bg-papaya hover:bg-orange-500 text-obsidian font-bold px-2.5 py-1 rounded transition-colors uppercase font-sans"
                          >
                            Claim
                          </button>
                        ) : claimStatus === 'pending' ? (
                          <span className="text-[10px] text-orange-400 bg-papaya/10 border border-papaya/30 px-2 py-0.5 rounded font-bold font-sans">
                            Pending
                          </span>
                        ) : (
                          <span className="text-[10px] text-green-400 bg-green-500/10 border border-green-500/30 px-2 py-0.5 rounded font-bold font-sans flex items-center gap-1 justify-center max-w-[60px] mx-auto">
                            <Check size={10} /> Paid
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Program 2: Commission tier structure info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Coins size={18} className="text-green-400 animate-pulse" />
            <h2 className="font-silkscreen text-white text-sm sm:text-base tracking-wider">
              § BI-WEEKLY COMMISSIONS DECK
            </h2>
          </div>
          <p className="text-text-secondary text-xs">
            Calculated over cyclical wagers in a 14-day slot window. Commission checks compile automatically and reset bi-weekly. Direct transfer payments are made on the 1st and 15th!
          </p>

          <div className="overflow-hidden rounded-xl border border-obsidian-light bg-obsidian text-xs font-mono">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-obsidian-dark/65 text-[10px] text-text-secondary border-b border-obsidian-light uppercase">
                  <th className="py-3 px-4">Cycle Wagers</th>
                  <th className="py-3 px-4 text-right pr-6">Affiliate Rate Pay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-obsidian-light/40">
                {COMMISSION_TIERS.map((tier) => (
                  <tr key={tier.threshold} className="hover:bg-obsidian-dark/25 transition-colors">
                    <td className="py-3 px-4 font-bold text-chalk">
                      ${(tier.threshold / 1000).toLocaleString()}k + Wagered XP
                    </td>
                    <td className="py-3 px-4 text-right text-green-450 font-extrabold pr-6 font-sans text-sm">
                      {tier.rate}% Rate Split
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Special rule comment */}
          <div className="bg-obsidian-light bg-opacity-30 p-4 rounded-xl border border-obsidian-light flex items-start gap-3">
            <BadgeHelp size={16} className="text-papaya shrink-0 mt-0.5" />
            <p className="text-text-secondary text-[11px] leading-relaxed">
              <strong>Rules reset:</strong> Wager pools for commission rates reset automatically at UTC Midnight on the bi-weekly cut-off. Any unclaimed payroll values roll over to your direct email billing department securely.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive commission and tier calculator */}
      <section className="bg-gradient-to-tr from-obsidian-dark to-obsidian border-2 border-obsidian-light p-6 rounded-2xl relative">
        <div className="absolute top-0 right-1/4 h-32 w-32 rounded-full bg-papaya/5 blur-[50px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
          <div className="space-y-4 max-w-md w-full">
            <div className="flex items-center gap-2">
              <Calculator size={18} className="text-papaya" />
              <h3 className="font-silkscreen text-white text-sm uppercase">Interactive Earnings Estimates</h3>
            </div>
            <p className="text-text-secondary text-xs">
              Slide or enter any Thrill casino wagering total volume below to compute rate scales, level milestones, and bi-weekly payouts.
            </p>

            <div className="space-y-3 pt-2">
              <label className="text-[10px] font-mono text-text-secondary block uppercase">WAGERED AMOUNT (USD / XP)</label>
              
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm font-mono">$</span>
                <input
                  type="number"
                  value={calcWager}
                  onChange={(e) => setCalcWager(Math.max(0, Number(e.target.value) || 0))}
                  className="bg-obsidian-dark border border-obsidian-light text-chalk font-mono text-base rounded-md pl-7 pr-4 py-2 w-full focus:outline-none focus:border-papaya transition-all"
                />
              </div>

              <input
                type="range"
                min="1000"
                max="1250000"
                step="5000"
                value={Math.min(1250000, calcWager)}
                onChange={(e) => setCalcWager(Number(e.target.value))}
                className="w-full accent-papaya cursor-pointer"
              />
            </div>
          </div>

          {/* Calculator Results Screen */}
          <div className="grid grid-cols-2 gap-4 bg-obsidian-dark border border-obsidian-light p-5 rounded-xl w-full max-w-sm shrink-0">
            <div className="bg-obsidian/45 p-3 rounded border border-obsidian-light/30">
              <span className="text-[9px] font-mono text-text-secondary block">COMMISSION RATE</span>
              <strong className="text-green-400 text-lg sm:text-xl font-sans block">{rate}% Split</strong>
            </div>

            <div className="bg-obsidian/45 p-3 rounded border border-obsidian-light/30">
              <span className="text-[9px] font-mono text-text-secondary block">ESTIMATED PAYOUT</span>
              <strong className="text-papaya text-lg sm:text-xl font-sans block">${estimatedPayout.toLocaleString()}</strong>
            </div>

            <div className="bg-obsidian/45 p-3 rounded border border-obsidian-light/30">
              <span className="text-[9px] font-mono text-text-secondary block">VIP QUALIFICATION</span>
              <strong className="text-white text-xs font-mono block">VIP LEVEL: {level}</strong>
            </div>

            <div className="bg-obsidian/45 p-3 rounded border border-obsidian-light/30">
              <span className="text-[9px] font-mono text-text-secondary block">NEXT MILESTONE</span>
              {nextMilestone ? (
                <div className="text-[10px] font-mono text-text-secondary">
                  <span className="text-chalk block font-bold">${(nextMilestone.threshold / 1000).toLocaleString()}k XP</span>
                  <span className="text-[8px] block">Needs: ${((nextMilestone.threshold - calcWager) / 1000).toLocaleString()}k</span>
                </div>
              ) : (
                <span className="text-green-400 text-xs font-extrabold uppercase">MAX LEVEL!</span>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
