/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Megaphone, 
  HelpCircle, 
  Sparkles, 
  Coins, 
  Layers, 
  Compass, 
  Check, 
  AlertCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Promotion } from '../types';

interface PromotionsTabProps {
  promotions: Promotion[];
  user: any;
  onJoinPromotion: (promoId: string) => Promise<void>;
  loadingPromoId: string | null;
}

export default function PromotionsTab({ promotions, user, onJoinPromotion, loadingPromoId }: PromotionsTabProps) {
  const [successId, setSuccessId] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  const activePromos = promotions.filter(p => p.status === 'active');
  const pastPromos = promotions.filter(p => p.status === 'completed');

  const handleJoinOptIn = async (promoId: string) => {
    if (!user) {
      setErrorText("Kindly login to register and join current promotions.");
      setTimeout(() => setErrorText(null), 4000);
      return;
    }

    try {
      setErrorText(null);
      await onJoinPromotion(promoId);
      setSuccessId(promoId);
      setTimeout(() => setSuccessId(null), 4500);
    } catch (err: any) {
      setErrorText(err.message || " Opting into promotion failed.");
      setTimeout(() => setErrorText(null), 4000);
    }
  };

  return (
    <div className="space-y-10 pb-16 animate-fade-in font-sans">
      
      {/* Promo Header Container */}
      <div className="bg-gradient-to-r from-obsidian via-obsidian-light to-obsidian border border-obsidian-light p-6 rounded-2xl relative overflow-hidden shadow-xl">
        <div className="absolute top-1/2 -translate-y-1/2 right-4 h-40 w-40 rounded-full bg-papaya/10 blur-[80px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 text-center md:text-left">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-papaya/15 text-papaya border border-papaya/30 text-xs px-3 py-1 rounded font-bold font-mono">
              <Megaphone size={14} className="animate-pulse" /> CHALLENGES & BONUSES
            </div>
            <h1 className="font-silkscreen text-2xl sm:text-3.5xl text-white tracking-wide">
              CAMPAIGNS & SLOT HUNTS
            </h1>
            <p className="text-text-secondary text-xs sm:text-sm max-w-xl">
              We run Slot Hunts (sweet multipliers!), bonus hunts, first-to-hit challenges, and tournaments over slots, live dealer, and original mini-games. Join below to list and earn.
            </p>
          </div>

          <a 
            href="https://thrill.com/casino?r=OLDMAN" 
            target="_blank" 
            rel="noreferrer"
            className="bg-obsidian-dark text-chalk border border-obsidian-light/60 hover:border-papaya px-5 py-2.5 rounded text-xs font-bold font-mono flex items-center justify-center gap-2 shrink-0 transition-colors"
          >
            OPEN THRILL CASINO <ExternalLink size={12} className="text-papaya stroke-[2.5]" />
          </a>
        </div>
      </div>

      {errorText && (
        <div className="bg-marsala/10 border border-marsala/40 text-red-100 p-4 rounded-xl flex items-center gap-3 text-xs font-mono">
          <AlertCircle size={15} className="text-red-400" />
          <span>{errorText}</span>
        </div>
      )}

      {/* Grid structure of active campaigns */}
      <section className="space-y-6">
        <h2 className="font-silkscreen text-sm tracking-widest text-text-secondary uppercase">
          🎰 ONGOING PROMOTIONS ({activePromos.length})
        </h2>

        {activePromos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activePromos.map((promo) => {
              const joined = user && promo.joinedUsers.includes(user.id);
              const successJoinedNow = successId === promo.id;

              return (
                <div 
                  key={promo.id} 
                  className={`bg-obsidian border border-obsidian-light/70 rounded-xl overflow-hidden p-5 flex flex-col justify-between gap-5 transition-all shadow-md hover:border-text-secondary/40 relative ${
                    joined ? 'ring-1 ring-green-500/20' : ''
                  }`}
                >
                  <div className="space-y-4">
                    {/* ICON representation and slot category badge */}
                    <div className="flex justify-between items-center">
                      <div className="h-12 w-12 rounded bg-obsidian-dark border border-obsidian-light/40 flex items-center justify-center text-2xl shadow-inner shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
                        {promo.imageIcon || '🎰'}
                      </div>
                      
                      <span className="text-[9px] font-mono font-bold tracking-widest uppercase bg-obsidian-dark text-text-secondary px-2.5 py-1 rounded">
                        {promo.type.replace('-', ' ')}
                      </span>
                    </div>

                    {/* Meta info */}
                    <div className="space-y-2">
                      <h3 className="text-white text-sm font-bold tracking-wide leading-snug">
                        {promo.title}
                      </h3>
                      {promo.slotName && (
                        <div className="text-[10px] font-mono text-papaya">
                          GAME: <span className="text-chalk">{promo.slotName}</span>
                        </div>
                      )}
                      <p className="text-text-secondary text-[11px] leading-relaxed">
                        {promo.desc}
                      </p>
                    </div>2
                  </div>

                  {/* Rewards structure display */}
                  <div className="space-y-4 mt-auto">
                    <div className="bg-obsidian-dark/90 border border-obsidian-light/40 py-2.5 px-3.5 rounded">
                      <span className="text-[9px] font-mono text-text-secondary block uppercase mb-0.5">REWARD PAYOUT</span>
                      <strong className="text-green-400 text-xs font-semibold">{promo.reward}</strong>
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-mono text-text-secondary pt-1.5 border-t border-obsidian-light/40">
                      <span>PARTICIPANTS</span>
                      <strong className="text-chalk">{promo.participantsCount} Opted In</strong>
                    </div>

                    {/* Opt-in elements */}
                    <div>
                      {joined || successJoinedNow ? (
                        <div className="w-full bg-green-500/10 border border-green-500/30 text-green-400 rounded py-2 text-center text-xs font-extrabold font-mono flex items-center justify-center gap-1.5 shadow-sm">
                          <Check size={12} className="stroke-[3px]" /> YOU ARE IN
                        </div>
                      ) : (
                        <button
                          id={`opt-in-promo-${promo.id}`}
                          onClick={() => handleJoinOptIn(promo.id)}
                          disabled={loadingPromoId === promo.id}
                          className="w-full bg-obsidian-dark border border-obsidian-light hover:border-papaya text-chalk hover:text-papaya font-bold py-2 rounded text-xs transition-colors uppercase tracking-wider font-mono shadow-sm"
                        >
                          {loadingPromoId === promo.id ? 'VERIFYING...' : 'Opt In / Register'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-obsidian rounded-xl border border-obsidian-light/60 p-10 text-center text-xs text-text-secondary font-mono">
            All seasonal promotions currently closed. Wait for streams or announcements!
          </div>
        )}
      </section>

      {/* Done or Draft Campaigns */}
      {pastPromos.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-silkscreen text-xs tracking-widest text-text-secondary uppercase">
            🏆 CLOSED MULTIPLIER HUNTS
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastPromos.map((promo) => (
              <div key={promo.id} className="bg-obsidian border border-obsidian-light/40 rounded-xl p-4 text-xs space-y-2 opacity-60">
                <div className="flex justify-between items-center font-mono text-[9px] text-text-secondary">
                  <span>CLEARED Hunt</span>
                  <span>{promo.type.replace('-', ' ')}</span>
                </div>
                <h4 className="text-chalk font-semibold truncate">{promo.title}</h4>
                <div className="text-green-400 font-mono font-bold text-[10px]">Reward Claimed: {promo.reward}</div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
