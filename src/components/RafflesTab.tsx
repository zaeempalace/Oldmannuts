/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Gift, 
  Clock, 
  Users, 
  Sparkles, 
  AlertTriangle,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { Raffle } from '../types';

interface RafflesTabProps {
  raffles: Raffle[];
  user: any;
  onJoinRaffle: (raffleId: string) => Promise<void>;
  loadingRaffleId: string | null;
}

export default function RafflesTab({ raffles, user, onJoinRaffle, loadingRaffleId }: RafflesTabProps) {
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const activeRaffles = raffles.filter(r => r.status === 'active');
  const pastRaffles = raffles.filter(r => r.status === 'drawn');

  const handleEnter = async (raffleId: string, wagerRequired: number) => {
    if (!user) {
      setErrorMsg("Please sign in or register an account to enter community giveaways.");
      setTimeout(() => setErrorMsg(null), 4000);
      return;
    }

    if (user.xp < wagerRequired) {
      setErrorMsg(`Insufficient Cycle XP! This raffle requires $${wagerRequired.toLocaleString()} wagered current cycle. You have wagered $${user.xp.toLocaleString()}`);
      setTimeout(() => setErrorMsg(null), 5000);
      return;
    }

    try {
      setErrorMsg(null);
      await onJoinRaffle(raffleId);
      setSuccessMsg("Successfully entered in raffle! Good luck!");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to join raffle.");
      setTimeout(() => setErrorMsg(null), 4000);
    }
  };

  return (
    <div className="space-y-10 pb-16 animate-fade-in font-sans">
      
      {/* Raffles Header Information */}
      <div className="bg-gradient-to-r from-obsidian via-obsidian-light to-obsidian border border-obsidian-light p-6 rounded-2xl relative overflow-hidden shadow-xl">
        <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-green-500/10 blur-[80px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 text-center md:text-left">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-green-500/15 text-green-400 border border-green-500/30 text-xs px-3 py-1 rounded font-bold font-mono">
              <Gift size={14} className="animate-pulse" /> WEEKLY ACTIVE REWARDS
            </div>
            <h1 className="font-silkscreen text-2xl sm:text-3.5xl text-white tracking-wide">
              GIVEAWAYS & COMMUNITY RAFFLES
            </h1>
            <p className="text-text-secondary text-xs sm:text-sm max-w-xl">
              We reward our community daily. Earn raffle entries by completing wager targets on Thrill (using affiliate code OLDMAN) or participating in stream tasks.
            </p>
          </div>

          <div className="bg-obsidian-dark border border-obsidian-light/60 p-4 rounded-xl flex items-center gap-3 w-full md:w-auto shrink-0 justify-center">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-ping" />
            <span className="text-text-secondary text-xs font-mono">VERIFIED LIVE RAFFLES RUNNING FOR COMPULSORY CHECKS</span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="bg-green-500/10 border border-green-500/40 text-green-400 p-4 rounded-xl flex items-center gap-3 text-xs">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-marsala/10 border border-marsala/40 text-red-400 p-4 rounded-xl flex items-center gap-3 text-xs">
          <AlertTriangle size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Active Raffles list */}
      <section className="space-y-6">
        <h2 className="font-silkscreen text-sm tracking-widest text-text-secondary uppercase">
          🚨 ACTIVE DRAWINGS ({activeRaffles.length})
        </h2>

        {activeRaffles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeRaffles.map((raffle) => {
              const userInRaffle = user && raffle.participants.some(p => p.userId === user.id);
              const isWagerLocked = user && user.xp < raffle.wagerRequired;
              const fillPercentage = Math.min(100, (raffle.slotsFilled / raffle.slotsMax) * 100);

              return (
                <div 
                  key={raffle.id} 
                  className={`bg-obsidian border border-obsidian-light rounded-xl overflow-hidden shadow-lg p-5 flex flex-col justify-between gap-6 relative transition-all hover:border-obsidian-light/80 ${
                    userInRaffle ? 'ring-1 ring-green-500/30 border-green-500/30' : ''
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <span className="bg-gradient-to-r from-papaya/10 to-orange-500/10 border border-papaya/30 text-papaya font-silkscreen text-[10px] px-2.5 py-1 rounded">
                        GIVEAWAY
                      </span>
                      <div className="flex items-center gap-1.5 text-text-secondary text-xs font-mono">
                        <Clock size={12} className="stroke-[2.5]" />
                        <span>Draws in: <strong className="text-chalk">2 Days</strong></span>
                      </div>
                    </div>

                    <h3 className="text-white text-base font-bold font-sans tracking-wide">
                      {raffle.title}
                    </h3>
                    
                    <div className="bg-obsidian-dark border border-obsidian-light/40 py-2.5 px-3.5 rounded text-xs">
                      <span className="text-[10px] font-mono text-text-secondary block mb-1">PRIZE POOL</span>
                      <strong className="text-green-400 text-sm font-sans flex items-center gap-1.5">
                        <Sparkles size={14} className="text-papaya" /> {raffle.prize}
                      </strong>
                    </div>

                    {/* Requirement text */}
                    <p className="text-text-secondary text-xs leading-relaxed font-mono">
                      Requirement: {raffle.entryRequirement}
                    </p>
                  </div>

                  {/* Meter Slots filled progress bar */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-mono text-[10px] text-text-secondary">
                      <span>ENTRIES CLAIMED</span>
                      <span>{raffle.slotsFilled} / {raffle.slotsMax} Seats Max</span>
                    </div>
                    <div className="h-2 w-full bg-obsidian-dark rounded-full overflow-hidden border border-obsidian-light/30">
                      <div 
                        className="bg-gradient-to-r from-papaya to-orange-500 h-full transition-all duration-500 rounded-full" 
                        style={{ width: `${fillPercentage}%` }} 
                      />
                    </div>
                  </div>

                  {/* Submission triggers */}
                  <div>
                    {userInRaffle ? (
                      <div className="w-full bg-green-500/10 border border-green-500/30 text-green-400 rounded-md py-2.5 text-center text-xs font-bold font-mono flex items-center justify-center gap-2">
                        <CheckCircle2 size={14} /> ENTRY REGISTERED
                      </div>
                    ) : isWagerLocked ? (
                      <div className="w-full bg-marsala/15 border border-marsala/30 text-red-400 rounded-md py-2.5 text-center text-xs font-semibold flex items-center justify-center gap-2">
                        <Lock size={14} /> REQUIRES ${(raffle.wagerRequired / 1000).toLocaleString()}k CYCLE XP (YOU HAVE ${(user.xp / 1000).toLocaleString()}k)
                      </div>
                    ) : (
                      <button
                        id={`enter-raffle-btn-${raffle.id}`}
                        onClick={() => handleEnter(raffle.id, raffle.wagerRequired)}
                        disabled={loadingRaffleId === raffle.id}
                        className="w-full bg-papaya hover:bg-orange-500 disabled:bg-opacity-50 text-obsidian font-bold py-2.5 rounded text-xs uppercase tracking-wider transition-all shadow hover:shadow-lg"
                      >
                        {loadingRaffleId === raffle.id ? 'Connecting Wallet API...' : 'Claim Raffle Seat'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-obsidian rounded-xl border border-obsidian-light/60 p-10 text-center text-xs text-text-secondary font-mono">
            There are currently no active automated community raffles. Follow live streams for manual chat drops!
          </div>
        )}
      </section>

      {/* Drawn Raffles history */}
      <section className="space-y-6">
        <h2 className="font-silkscreen text-sm tracking-widest text-text-secondary uppercase">
          🏆 PAST WINNERS LOG ({pastRaffles.length})
        </h2>

        {pastRaffles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pastRaffles.map((raffle) => (
              <div key={raffle.id} className="bg-obsidian border border-obsidian-light rounded-xl p-4 flex flex-col justify-between gap-4 text-xs">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-text-secondary block">DRAWN GIVEAWAY</span>
                  <h3 className="text-white text-xs font-semibold font-mono truncate">{raffle.title}</h3>
                  <div className="text-green-400 text-xs font-mono font-medium">Prize: {raffle.prize}</div>
                </div>

                <div className="bg-obsidian-dark/90 border border-obsidian-light/50 p-2.5 rounded font-mono text-[11px] text-text-secondary flex flex-wrap gap-2 items-center">
                  <span>Lucky Winners:</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {raffle.winners.map((winner, i) => (
                      <span key={i} className="text-papaya font-bold bg-papaya/10 border border-papaya/30 px-1.5 py-0.5 rounded text-[10px]">
                        {winner.substring(0, 3)}***
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-obsidian rounded-xl border border-obsidian-light/60 p-6 text-center text-xs text-text-secondary font-mono">
            No history available at present. Let's spin together!
          </div>
        )}
      </section>

    </div>
  );
}
