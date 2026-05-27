/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Trophy, 
  Megaphone, 
  Users, 
  Coins, 
  Settings, 
  History, 
  Plus, 
  Trash2, 
  Check, 
  Key, 
  RefreshCw, 
  UserPlus, 
  Edit, 
  Clock,
  ShieldCheck,
  Calendar,
  Gift
} from 'lucide-react';
import { 
  User, 
  LeaderboardEntry, 
  Promotion, 
  Raffle, 
  Payout, 
  AuditLog, 
  SystemConfig,
  PromotionType
} from '../types';

interface AdminTabProps {
  leaderboard: LeaderboardEntry[];
  promotions: Promotion[];
  raffles: Raffle[];
  payouts: Payout[];
  users: User[];
  auditLogs: AuditLog[];
  config: SystemConfig;
  onRefresh: () => void;
  
  // Actions
  onUpdateConfig: (data: Partial<SystemConfig>) => Promise<void>;
  onManageLeaderboard: (username: string, xp: number) => Promise<void>;
  onRemoveLeaderboard: (id: string) => Promise<void>;
  onSavePromotion: (data: any) => Promise<void>;
  onDeletePromotion: (id: string) => Promise<void>;
  onSaveRaffle: (data: any) => Promise<void>;
  onDrawRaffle: (id: string) => Promise<void>;
  onDeleteRaffle: (id: string) => Promise<void>;
  onUpdatePayoutStatus: (id: string, status: 'pending' | 'approved' | 'paid') => Promise<void>;
  onUpdateUser: (id: string, data: Partial<User>) => Promise<void>;
}

export default function AdminTab({
  leaderboard,
  promotions,
  raffles,
  payouts,
  users,
  auditLogs,
  config,
  onRefresh,
  onUpdateConfig,
  onManageLeaderboard,
  onRemoveLeaderboard,
  onSavePromotion,
  onDeletePromotion,
  onSaveRaffle,
  onDrawRaffle,
  onDeleteRaffle,
  onUpdatePayoutStatus,
  onUpdateUser,
}: AdminTabProps) {
  
  const [subTab, setSubTab] = useState<'lb' | 'promos' | 'raffles' | 'payroll' | 'players' | 'keys' | 'logs'>('payroll');

  // Input states
  const [lbUser, setLbUser] = useState('');
  const [lbXp, setLbXp] = useState(0);

  const [promoForm, setPromoForm] = useState({
    id: '',
    title: '',
    type: 'slot-hunt' as PromotionType,
    slotName: '',
    imageIcon: '',
    desc: '',
    reward: '',
    status: 'active' as 'active' | 'completed' | 'draft',
    targetXp: 0
  });

  const [raffleForm, setRaffleForm] = useState({
    title: '',
    prize: '',
    entryRequirement: '',
    wagerRequired: 0,
    slotsMax: 100
  });

  const [simUserXpId, setSimUserXpId] = useState('');
  const [simUserXpVal, setSimUserXpVal] = useState(0);
  const [simUserLegacyVal, setSimUserLegacyVal] = useState(0);

  const [newKey, setNewKey] = useState('');
  const [cycleStart, setCycleStart] = useState(config?.cycleStart || '');
  const [cycleEnd, setCycleEnd] = useState(config?.cycleEnd || '');
  const [prizeBudget, setPrizeBudget] = useState(config?.totalRacePrizePool || 12500);

  // Status indicators
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const showSuccess = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const showError = (msg: string) => {
    setActionError(msg);
    setTimeout(() => setActionError(null), 4000);
  };

  // Submission handles
  const handleLbSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lbUser.trim()) return;
    try {
      await onManageLeaderboard(lbUser, lbXp);
      showSuccess(`Player "${lbUser}" added/updated on leaderboard.`);
      setLbUser('');
      setLbXp(0);
    } catch (err: any) {
      showError(err.message || 'Error managing leaderboard');
    }
  };

  const handleLbRemove = async (id: string) => {
    if (!window.confirm("Do you absolutely intend to drop this player row?")) return;
    try {
      await onRemoveLeaderboard(id);
      showSuccess("Roster entry dropped.");
    } catch (err: any) {
      showError(err.message || 'Error removal');
    }
  };

  const handlePromoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoForm.title || !promoForm.reward) {
      showError("Campaign titles & reward configurations are compulsory!");
      return;
    }
    try {
      await onSavePromotion(promoForm);
      showSuccess(`Campaign "${promoForm.title}" recorded successfully.`);
      // Reset form
      setPromoForm({
        id: '',
        title: '',
        type: 'slot-hunt',
        slotName: '',
        imageIcon: '',
        desc: '',
        reward: '',
        status: 'active',
        targetXp: 0
      });
    } catch (err: any) {
      showError(err.message || "Failed saving promotion Campaign.");
    }
  };

  const handleRaffleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!raffleForm.title || !raffleForm.prize) {
      showError("Draft titles and prize fields are required.");
      return;
    }
    try {
      await onSaveRaffle(raffleForm);
      showSuccess(`Raffle "${raffleForm.title}" scheduled.`);
      setRaffleForm({
        title: '',
        prize: '',
        entryRequirement: '',
        wagerRequired: 0,
        slotsMax: 100
      });
    } catch (err: any) {
      showError(err.message || "Raffle scheduler error.");
    }
  };

  const handleRaffleDraw = async (id: string, name: string) => {
    try {
      await onDrawRaffle(id);
      showSuccess(`Drawn lucky winners for raffle Campaign "${name}"!`);
    } catch (err: any) {
      showError(err.message || "Raffle drawing operation crashed.");
    }
  };

  const handleKeyRotate = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = newKey.trim();
    if (!cleanKey) return;
    try {
      await onUpdateConfig({ thrillApiKey: cleanKey });
      showSuccess("Rotated Thrill Affiliate endpoint credentials successfully!");
      setNewKey('');
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleCycleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onUpdateConfig({ cycleStart, cycleEnd, totalRacePrizePool: Number(prizeBudget) });
      showSuccess("Wager racer timeframe schedule parameters committed.");
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleUserOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simUserXpId) return;
    try {
      const selected = users.find(u => u.id === simUserXpId);
      if (!selected) return;
      
      const newLevel = Math.max(1, Math.min(7, Math.floor(simUserLegacyVal / 50000) + 1)); // auto level logic

      await onUpdateUser(simUserXpId, { 
        xp: Number(simUserXpVal), 
        totalXp: Number(simUserLegacyVal),
        level: newLevel
      });
      showSuccess(`Manually adjusted wager credits for gamer ${selected.username}.`);
      setSimUserXpId('');
      setSimUserXpVal(0);
      setSimUserLegacyVal(0);
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handlePayoutTrigger = async (id: string, newStats: 'pending' | 'approved' | 'paid') => {
    try {
      await onUpdatePayoutStatus(id, newStats);
      showSuccess(`Transaction ID ${id} set as ${newStats.toUpperCase()}.`);
    } catch (err: any) {
      showError(err.message);
    }
  };

  return (
    <div className="space-y-8 pb-20 animate-fade-in font-sans text-xs">
      
      {/* Visual Header */}
      <div className="bg-gradient-to-r from-marsala/20 via-obsidian-light to-obsidian border border-marsala/40 p-5 rounded-2xl flex items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 bg-marsala/20 text-red-400 border border-marsala/30 text-[10px] px-2.5 py-1 rounded font-bold font-mono tracking-wider">
            <ShieldCheck size={14} /> ADMINISTRATOR SECURITY SYSTEM
          </div>
          <h1 className="font-silkscreen text-xl text-white tracking-widest leading-none font-bold uppercase">
            OldManNuts Command Console
          </h1>
          <p className="text-text-secondary text-[11px]">
            Direct database CRUD access, payout settlement trackers, affiliate key rotations, and player credential overrides.
          </p>
        </div>

        <button 
          onClick={onRefresh}
          className="p-2 border border-obsidian-light hover:border-text-secondary rounded bg-obsidian-dark hover:bg-obsidian font-semibold transition-all flex items-center gap-2 font-mono"
          title="Synchronous Refetch"
        >
          <RefreshCw size={14} className="animate-spin text-papaya" /> Refetch APIs
        </button>
      </div>

      {/* Internal notifications */}
      {actionSuccess && (
        <div className="bg-green-500/10 border border-green-500/35 text-green-400 p-3.5 rounded-lg font-mono">
          [SUCCESS]: {actionSuccess}
        </div>
      )}

      {actionError && (
        <div className="bg-marsala/10 border border-marsala/40 text-red-400 p-3.5 rounded-lg font-mono">
          [FAILURE CRUCIAL]: {actionError}
        </div>
      )}

      {/* Admin SubNavigation */}
      <div className="flex border-b border-obsidian-light overflow-x-auto no-scrollbar gap-1">
        {[
          { id: 'payroll', label: 'PAYOUT MATRIX', icon: Coins },
          { id: 'lb', label: 'LEADERBOARD', icon: Trophy },
          { id: 'promos', label: 'CAMPAIGNS', icon: Megaphone },
          { id: 'raffles', label: 'RAFFLES PLAN', icon: Gift },
          { id: 'players', label: 'PLAYERS OVERRIDE', icon: Users },
          { id: 'keys', label: 'SYSTEM CONFIG', icon: Settings },
          { id: 'logs', label: 'AUDIT LOGS', icon: History }
        ].map((item) => {
          const Icon = item.icon;
          const isAct = subTab === item.id;
          return (
            <button
              id={`admin-subtab-${item.id}`}
              key={item.id}
              onClick={() => setSubTab(item.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 font-bold transition-all whitespace-nowrap ${
                isAct 
                  ? 'border-b-2 border-papaya text-papaya bg-obsidian/30' 
                  : 'text-text-secondary hover:text-white border-b-2 border-transparent'
              }`}
            >
              <Icon size={14} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB TAB CONTROLS */}

      {/* TAB 1: Payout ledger tracker */}
      {subTab === 'payroll' && (
        <div className="space-y-6">
          <div className="space-y-1.5 border-b border-obsidian-light pb-2">
            <h2 className="text-white text-sm font-bold font-sans">Active Claim Payroll Forms</h2>
            <p className="text-text-secondary text-[11px] leading-snug">
              Review claim submissions from affiliate players. Verify credentials on Thrill admin portal before clicking "Confirm Paid" trigger.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-obsidian-light bg-obsidian font-mono">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-obsidian-dark/70 text-text-secondary border-b border-obsidian-light">
                  <th className="py-3 px-4">Player Handle</th>
                  <th className="py-3 px-4">Thrill Connected ID</th>
                  <th className="py-3 px-4 text-right">Sum Payout</th>
                  <th className="py-3 px-4">Period / Run Details</th>
                  <th className="py-3 px-4 text-center">Receipt Status</th>
                  <th className="py-3 px-4 pr-4 text-center w-48">Trigger Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-obsidian-light/40">
                {payouts.length > 0 ? (
                  payouts.map((pay) => (
                    <tr key={pay.id} className="hover:bg-obsidian-dark/15 transition-colors">
                      <td className="py-3 px-4">
                        <div className="text-chalk font-bold font-sans">{pay.username}</div>
                        <div className="text-[10px] text-text-secondary">{pay.userEmail}</div>
                      </td>
                      <td className="py-3 px-4">{pay.thrillName}</td>
                      <td className="py-3 px-4 text-right pr-6 font-sans font-extrabold text-green-450">${pay.amount}</td>
                      <td className="py-3 px-4">
                        <span className="text-chalk text-[11px] block">{pay.period}</span>
                        <p className="text-[10px] text-text-secondary max-w-xs truncate">{pay.details}</p>
                      </td>
                      <td className="py-3 px-4 text-center font-sans">
                        {pay.status === 'pending' ? (
                          <span className="text-orange-400 bg-papaya/10 border border-papaya/30 px-2 py-0.5 rounded text-[10px] font-bold">PENDING</span>
                        ) : pay.status === 'approved' ? (
                          <span className="text-blue-400 bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 rounded text-[10px] font-bold">APPROVED</span>
                        ) : (
                          <span className="text-green-400 bg-green-500/10 border border-green-500/30 px-2 py-0.5 rounded text-[10px] font-bold">PAID</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex gap-1.5 justify-center">
                          {pay.status === 'pending' && (
                            <button
                              id={`approve-btn-${pay.id}`}
                              onClick={() => handlePayoutTrigger(pay.id, 'approved')}
                              className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-2 py-1 rounded"
                            >
                              Approve
                            </button>
                          )}
                          {pay.status !== 'paid' && (
                            <button
                              id={`pay-btn-${pay.id}`}
                              onClick={() => handlePayoutTrigger(pay.id, 'paid')}
                              className="bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold px-2 py-1 rounded"
                            >
                              Confirm Paid
                            </button>
                          )}
                          {pay.status === 'paid' && (
                            <span className="text-[10px] text-green-400 flex items-center gap-0.5 justify-center">
                              <Check size={12} /> Settled
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-text-secondary">No payout claims currently listed in ledger database.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Leaderboard configuration */}
      {subTab === 'lb' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-obsidian border border-obsidian-light p-4 rounded-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-obsidian-light pb-2">
              <Trophy size={16} className="text-papaya" />
              <h3 className="text-white text-xs uppercase font-silkscreen">Insert / Adjust Player Race XP</h3>
            </div>

            <form onSubmit={handleLbSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-text-secondary block">USERNAME (THRILL CASINO DISPLAY-NAME)</label>
                <input
                  type="text"
                  placeholder="e.g. high_roller_joe"
                  value={lbUser}
                  onChange={(e) => setLbUser(e.target.value)}
                  required
                  className="bg-obsidian-dark border border-obsidian-light text-chalk px-3 py-2 w-full rounded focus:outline-none focus:border-papaya font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-text-secondary block font-bold">WAGER XP AMOUNT (USD VOLUME)</label>
                <input
                  type="number"
                  value={lbXp}
                  onChange={(e) => setLbXp(Math.max(0, Number(e.target.value) || 0))}
                  required
                  className="bg-obsidian-dark border border-obsidian-light text-chalk px-3 py-2 w-full rounded focus:outline-none focus:border-papaya font-mono font-bold"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-papaya hover:bg-orange-500 font-bold py-2.5 rounded text-xs text-obsidian uppercase transition-colors flex items-center gap-1 justify-center shadow"
              >
                <Plus size={14} /> Commit Entry to Roster
              </button>
            </form>
          </div>

          {/* Roster entries */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-white text-xs font-bold uppercase font-silkscreen">Bi-Weekly Leaderboard Player Ledger ({leaderboard.length})</h3>
            
            <div className="overflow-x-auto border border-obsidian-light rounded-xl font-mono">
              <table className="w-full text-left bg-obsidian">
                <thead>
                  <tr className="bg-obsidian-dark/60 text-text-secondary text-[10px] border-b border-obsidian-light uppercase">
                    <th className="py-2.5 px-4 w-12 text-center">Rank</th>
                    <th className="py-2.5 px-4">Player</th>
                    <th className="py-2.5 px-4 text-right">Cycle XP</th>
                    <th className="py-2.5 px-4 text-right pr-6">Manual Add</th>
                    <th className="py-2.5 px-4 text-center w-24">Drop Box</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-obsidian-light/40">
                  {leaderboard.map((player) => (
                    <tr key={player.id} className="hover:bg-obsidian-dark/15 transition-colors">
                      <td className="py-2 px-4 text-center font-bold text-papaya">#{player.rank}</td>
                      <td className="py-2 px-4 font-sans font-semibold text-chalk">{player.username}</td>
                      <td className="py-2 px-4 text-right text-text-secondary">${player.xp.toLocaleString()}</td>
                      <td className="py-2 px-4 text-right text-[10px] text-text-secondary pr-6">
                        {player.manuallyAdded ? 'Manual override' : 'API Scrape'}
                      </td>
                      <td className="py-2 px-4 text-center">
                        <button
                          onClick={() => handleLbRemove(player.id)}
                          className="text-red-400 hover:text-red-500 p-1"
                          title="Remove row completely"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Promotions CRUD */}
      {subTab === 'promos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-obsidian border border-obsidian-light p-4 rounded-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-obsidian-light pb-2">
              <Megaphone size={16} className="text-papaya" />
              <h3 className="text-white text-xs uppercase font-silkscreen">Add / Edit Promo Campaign</h3>
            </div>

            <form onSubmit={handlePromoSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-mono text-text-secondary">CAMPAIGN TITLE</label>
                <input
                  type="text"
                  placeholder="e.g. Gates of Olympus Max Mult Hunt"
                  value={promoForm.title}
                  onChange={(e) => setPromoForm({ ...promoForm, title: e.target.value })}
                  className="bg-obsidian-dark border border-obsidian-light text-chalk px-3 py-1.5 w-full rounded focus:outline-none focus:border-papaya"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-mono text-text-secondary">PROMO CATEGORY</label>
                  <select
                    value={promoForm.type}
                    onChange={(e) => setPromoForm({ ...promoForm, type: e.target.value as PromotionType })}
                    className="bg-obsidian-dark border border-obsidian-light text-chalk px-2 py-1.5 w-full rounded focus:outline-none focus:border-papaya"
                  >
                    <option value="slot-hunt">Slot-Hunt</option>
                    <option value="challenge">Challenge</option>
                    <option value="wager-race">Wager-Race</option>
                    <option value="bonus-hunt">Bonus-Hunt</option>
                    <option value="tournament">Tournament</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-mono text-text-secondary">GAME COVER ICON</label>
                  <select
                    value={promoForm.imageIcon}
                    onChange={(e) => setPromoForm({ ...promoForm, imageIcon: e.target.value })}
                    className="bg-obsidian-dark border border-obsidian-light text-chalk px-2 py-1.5 w-full rounded focus:outline-none"
                  >
                    <option value="">Choose Icon</option>
                    <option value="🍒">🍒 Cherries (Bonanza)</option>
                    <option value="👑">👑 Crown (Zeus / Gates)</option>
                    <option value="🤠">🤠 Cowboy (Wanted)</option>
                    <option value="🎰">🎰 Classic Slot</option>
                    <option value="🦁">🦁 Jungle Lion</option>
                    <option value="📈">📈 Charts Race</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono text-text-secondary">SLOT NAME (IF APPLICABLE)</label>
                <input
                  type="text"
                  placeholder="e.g. Sweet Bonanza 1000"
                  value={promoForm.slotName}
                  onChange={(e) => setPromoForm({ ...promoForm, slotName: e.target.value })}
                  className="bg-obsidian-dark border border-obsidian-light text-chalk px-3 py-1.5 w-full rounded"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono text-text-secondary">REWARD SCALE TEXT</label>
                <input
                  type="text"
                  placeholder="e.g. $250 Custom Balance + VIP XP"
                  value={promoForm.reward}
                  onChange={(e) => setPromoForm({ ...promoForm, reward: e.target.value })}
                  className="bg-obsidian-dark border border-obsidian-light text-chalk px-3 py-1.5 w-full rounded"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono text-text-secondary">DETAILED INSTRUCTIONS</label>
                <textarea
                  placeholder="Specific multiplier ratios or minimum bets requirements..."
                  value={promoForm.desc}
                  rows={2}
                  onChange={(e) => setPromoForm({ ...promoForm, desc: e.target.value })}
                  className="bg-obsidian-dark border border-obsidian-light text-chalk p-3.5 w-full rounded focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-papaya hover:bg-orange-500 font-bold py-2.5 rounded text-xs text-obsidian uppercase flex items-center justify-center gap-1"
              >
                Save Campaign
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-white text-xs font-bold uppercase font-silkscreen font-bold">Ongoing Campaigns Ledger</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {promotions.map((promo) => (
                <div key={promo.id} className="bg-obsidian border border-obsidian-light p-4 rounded-xl flex flex-col justify-between gap-4 font-mono">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] items-center text-text-secondary">
                      <span>{promo.id}</span>
                      <span className="text-papaya uppercase">{promo.type}</span>
                    </div>
                    <div className="text-chalk font-semibold text-xs font-sans">{promo.title}</div>
                    <p className="text-text-secondary text-[11px] font-sans leading-relaxed">{promo.desc}</p>
                    <div className="text-green-400">Payout: <span className="font-semibold">{promo.reward}</span></div>
                  </div>

                  <div className="flex gap-2 justify-end border-t border-obsidian-light/40 pt-2 text-[10px]">
                    <button
                      onClick={() => setPromoForm({
                        id: promo.id,
                        title: promo.title,
                        type: promo.type,
                        slotName: promo.slotName || '',
                        imageIcon: promo.imageIcon || '',
                        desc: promo.desc,
                        reward: promo.reward,
                        status: promo.status,
                        targetXp: promo.targetXp || 0
                      })}
                      className="bg-obsidian-dark border border-obsidian-light hover:border-papaya text-text-secondary hover:text-papaya px-2.5 py-1 rounded flex items-center gap-0.5"
                    >
                      <Edit size={10} /> Edit
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm(`Drop campaign: "${promo.title}"?`)) {
                          try {
                            await onDeletePromotion(promo.id);
                            showSuccess(`Dropped campaign.`);
                          } catch (err: any) {
                            showError(err.message);
                          }
                        }
                      }}
                      className="bg-marsala bg-opacity-20 border border-marsala/40 hover:border-red-500 text-red-400 hover:text-white px-2.5 py-1 rounded flex items-center gap-0.5"
                    >
                      <Trash2 size={10} /> Drop
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Raffles administration */}
      {subTab === 'raffles' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-obsidian border border-obsidian-light p-4 rounded-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-obsidian-light pb-2">
              <Gift size={16} className="text-papaya" />
              <h3 className="text-white text-xs uppercase font-silkscreen">Add Raffle Draw</h3>
            </div>

            <form onSubmit={handleRaffleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-mono text-text-secondary">GIVEAWAY TITLE</label>
                <input
                  type="text"
                  placeholder="e.g. $500 Weekly Mega Splash"
                  value={raffleForm.title}
                  onChange={(e) => setRaffleForm({ ...raffleForm, title: e.target.value })}
                  className="bg-obsidian-dark border border-obsidian-light text-chalk px-3 py-1.5 w-full rounded focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono text-text-secondary">PRIZE SUMMARY</label>
                <input
                  type="text"
                  placeholder="e.g. 5 Prizes of $100 Cash"
                  value={raffleForm.prize}
                  onChange={(e) => setRaffleForm({ ...raffleForm, prize: e.target.value })}
                  className="bg-obsidian-dark border border-obsidian-light text-chalk px-3 py-1.5 w-full rounded"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono text-text-secondary">XP WAGER REQUIRED</label>
                <input
                  type="number"
                  placeholder="e.g. 2500"
                  value={raffleForm.wagerRequired}
                  onChange={(e) => setRaffleForm({ ...raffleForm, wagerRequired: Number(e.target.value) || 0 })}
                  className="bg-obsidian-dark border border-obsidian-light text-chalk px-3 py-1.5 w-full rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-mono text-text-secondary">MAX SEATS</label>
                  <input
                    type="number"
                    value={raffleForm.slotsMax}
                    onChange={(e) => setRaffleForm({ ...raffleForm, slotsMax: Number(e.target.value) || 100 })}
                    className="bg-obsidian-dark border border-obsidian-light text-chalk px-2 py-1.5 w-full rounded"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono text-text-secondary">ENTRY RULES SUMMARY</label>
                  <input
                    type="text"
                    placeholder="Wager $2,500 under code"
                    value={raffleForm.entryRequirement}
                    onChange={(e) => setRaffleForm({ ...raffleForm, entryRequirement: e.target.value })}
                    className="bg-obsidian-dark border border-obsidian-light text-chalk px-2 py-1.5 w-full rounded"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-papaya hover:bg-orange-500 font-bold py-2 rounded text-xs text-obsidian uppercase flex items-center justify-center gap-1"
              >
                Schedule Drawing
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-white text-xs font-bold uppercase font-silkscreen font-bold">Raffles Drawings Panel</h3>
            
            <div className="overflow-x-auto rounded-xl border border-obsidian-light font-mono">
              <table className="w-full text-left bg-obsidian text-xs">
                <thead>
                  <tr className="bg-obsidian-dark/70 text-text-secondary text-[10px] uppercase border-b border-obsidian-light">
                    <th className="py-2.5 px-4">Title</th>
                    <th className="py-2.5 px-4">Prerequisites</th>
                    <th className="py-2.5 px-4 text-center">Entries Filled</th>
                    <th className="py-2.5 px-4">Outcome Winners</th>
                    <th className="py-2.5 px-4 text-center w-40">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-obsidian-light/40">
                  {raffles.length > 0 ? (
                    raffles.map((raf) => (
                      <tr key={raf.id} className="hover:bg-obsidian-dark/15 transition-colors">
                        <td className="py-3 px-4">
                          <div className="text-chalk font-semibold font-sans">{raf.title}</div>
                          <div className="text-[10px] text-green-450">Prize: {raf.prize}</div>
                        </td>
                        <td className="py-3 px-4 text-[10px] text-text-secondary">
                          Requires: ${raf.wagerRequired.toLocaleString()} XP
                        </td>
                        <td className="py-3 px-4 text-center">
                          {raf.slotsFilled} / {raf.slotsMax}
                        </td>
                        <td className="py-3 px-4">
                          {raf.status === 'drawn' ? (
                            <div className="flex gap-1 flex-wrap">
                              {raf.winners.map((winner, idx) => (
                                <span key={idx} className="bg-papaya/10 text-papaya border border-papaya/30 px-1 py-0.5 rounded text-[10px]">
                                  {winner}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-text-secondary text-[10px] font-sans">Awaiting draw</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex gap-1 justify-center">
                            {raf.status === 'active' && (
                              <button
                                id={`draw-raffle-${raf.id}`}
                                onClick={() => handleRaffleDraw(raf.id, raf.title)}
                                className="bg-gradient-to-r from-papaya to-orange-500 hover:from-orange-500 hover:to-papaya text-obsidian text-[10px] font-bold px-2 py-1 rounded shadow"
                              >
                                Trigger Draw
                              </button>
                            )}
                            <button
                              onClick={async () => {
                                if (confirm("Delete this raffle?")) {
                                  try {
                                    await onDeleteRaffle(raf.id);
                                    showSuccess("Deleted raffle.");
                                  } catch (err: any) {
                                    showError(err.message);
                                  }
                                }
                              }}
                              className="text-red-400 hover:text-red-500 p-1 rounded"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-text-secondary">No active drawings.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Player Override wagers */}
      {subTab === 'players' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-obsidian border border-obsidian-light p-4 rounded-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-obsidian-light pb-2">
              <Users size={16} className="text-papaya" />
              <h3 className="text-white text-xs uppercase font-silkscreen">Manual Player XP Balance Override</h3>
            </div>

            <form onSubmit={handleUserOverride} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-mono text-text-secondary block">SELECT PLAYER ACCOUNT</label>
                <select
                  value={simUserXpId}
                  onChange={(e) => {
                    const uId = e.target.value;
                    setSimUserXpId(uId);
                    const selected = users.find(u => u.id === uId);
                    if (selected) {
                      setSimUserXpVal(selected.xp);
                      setSimUserLegacyVal(selected.totalXp);
                    }
                  }}
                  required
                  className="bg-obsidian-dark border border-obsidian-light text-chalk px-2 py-2 w-full rounded focus:outline-none"
                >
                  <option value="">Choose registered user...</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.username} ({u.email})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono text-text-secondary block">BI-WEEKLY RUN XP ($ WAGERED)</label>
                <input
                  type="number"
                  value={simUserXpVal}
                  onChange={(e) => setSimUserXpVal(Number(e.target.value) || 0)}
                  className="bg-obsidian-dark border border-obsidian-light text-chalk px-3 py-1.5 w-full rounded font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono text-text-secondary block">LIFETIME LEGACY XP (TOTAL STAKE)</label>
                <input
                  type="number"
                  value={simUserLegacyVal}
                  onChange={(e) => setSimUserLegacyVal(Number(e.target.value) || 0)}
                  className="bg-obsidian-dark border border-obsidian-light text-chalk px-3 py-1.5 w-full rounded font-mono font-bold"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-papaya hover:bg-orange-500 font-bold py-2 rounded text-xs text-obsidian uppercase transition-colors"
              >
                Apply XP Adjustments
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-white text-xs font-bold uppercase font-silkscreen font-bold">Registered Users directory ({users.length})</h3>
            
            <div className="overflow-x-auto rounded-xl border border-obsidian-light font-mono">
              <table className="w-full text-left bg-obsidian text-xs">
                <thead>
                  <tr className="bg-obsidian-dark/65 text-text-secondary border-b border-obsidian-light text-[10px] uppercase">
                    <th className="py-2 px-3">Gamer</th>
                    <th className="py-2 px-3">Legacy XP</th>
                    <th className="py-2 px-3">Weekly XP</th>
                    <th className="py-2 px-3">Level VIP</th>
                    <th className="py-2 px-3">Verification ID</th>
                    <th className="py-2 px-3 text-center">Admin Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-obsidian-light/35">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-obsidian-dark/20">
                      <td className="py-2.5 px-3">
                        <div className="text-chalk font-semibold font-sans">{user.username}</div>
                        <div className="text-[10px] text-text-secondary">{user.email}</div>
                      </td>
                      <td className="py-2.5 px-3 text-text-secondary font-bold">${user.totalXp.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-papaya font-bold">${user.xp.toLocaleString()}</td>
                      <td className="py-2.5 px-3 font-sans font-bold">Level {user.level}</td>
                      <td className="py-2.5 px-3 text-[11px] text-text-secondary">
                        <div>Thrill: {user.thrillName || 'Unlinked'}</div>
                        <div>Kick: {user.kickName || 'Unlinked'}</div>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={user.isAdmin || false}
                          onChange={async (e) => {
                            try {
                              await onUpdateUser(user.id, { isAdmin: e.target.checked });
                              showSuccess(`Updated administration roles for user ${user.username}.`);
                            } catch (err: any) {
                              showError(err.message);
                            }
                          }}
                          className="accent-papaya h-4 w-4 rounded cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Keys and timing configurations */}
      {subTab === 'keys' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* API Key Rotation card */}
          <div className="bg-obsidian border border-obsidian-light p-5 sm:p-6 rounded-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-obsidian-light pb-2.5">
              <Key size={16} className="text-papaya animate-bounce" />
              <h3 className="font-silkscreen text-white text-xs uppercase tracking-wider">Thrill API Key credentials Rotation</h3>
            </div>
            
            <p className="text-text-secondary text-[11px] leading-relaxed">
              Your server uses this API token to fetch wager volume metrics, verify affiliate enrollment rosters, and secure payout transfers.
            </p>

            <div className="bg-obsidian-dark/70 border border-obsidian-light/55 p-3.5 rounded font-mono text-[11px]">
              <div className="text-text-secondary uppercase text-[9px] mb-1">Active Credentials Mask</div>
              <strong className="text-green-450 block font-bold mb-1">thrill_live_key_9df***2e</strong>
              <div className="text-[10px] text-text-secondary">
                Last Rotated (UTC): <span className="text-chalk">{config?.keyLastRotated ? new Date(config.keyLastRotated).toLocaleString() : 'N/A'}</span>
              </div>
            </div>

            <form onSubmit={handleKeyRotate} className="space-y-3 pt-2">
              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-text-secondary uppercase">Enter New Thrill Server Key</label>
                <input
                  type="password"
                  placeholder="New secret key hash..."
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  className="bg-obsidian-dark border border-obsidian-light text-chalk text-xs rounded-md px-3.5 py-2 w-full focus:outline-none focus:border-papaya font-mono"
                />
              </div>

              <button
                type="submit"
                className="bg-gradient-to-r from-papaya to-orange-500 hover:from-orange-500 hover:to-papaya text-obsidian font-bold py-2 px-5 rounded text-xs uppercase flex items-center gap-1.5 justify-center transition-colors"
                title="Secret key commitment"
              >
                <RefreshCw size={12} /> Commit API credentials Key
              </button>
            </form>
          </div>

          {/* Timeframes config cycles */}
          <div className="bg-obsidian border border-obsidian-light p-5 sm:p-6 rounded-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-obsidian-light pb-2.5">
              <Calendar size={16} className="text-green-400" />
              <h3 className="font-silkscreen text-white text-xs uppercase tracking-wider">Wager tracking time-frames & Budgets</h3>
            </div>

            <p className="text-text-secondary text-[11px] leading-relaxed">
              Set start and end timing dates for the active wagering race. Resets the user's weekly XP counters dynamically in calculation.
            </p>

            <form onSubmit={handleCycleSave} className="space-y-4 pt-1 font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[9px] text-text-secondary uppercase">RACE CYCLE START</label>
                  <input
                    type="date"
                    value={cycleStart}
                    onChange={(e) => setCycleStart(e.target.value)}
                    className="bg-obsidian-dark border border-obsidian-light text-chalk text-xs rounded-md px-3.5 py-2 w-full focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] text-text-secondary uppercase">RACE CYCLE END</label>
                  <input
                    type="date"
                    value={cycleEnd}
                    onChange={(e) => setCycleEnd(e.target.value)}
                    className="bg-obsidian-dark border border-obsidian-light text-chalk text-xs rounded-md px-3.5 py-2 w-full focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5 font-mono">
                <label className="text-[9px] text-text-secondary uppercase">RACE ALLOCATED PRIZE BUDGET (USD)</label>
                <input
                  type="number"
                  value={prizeBudget}
                  onChange={(e) => setPrizeBudget(Number(e.target.value) || 12500)}
                  className="bg-obsidian-dark border border-obsidian-light text-chalk text-xs rounded-md px-3.5 py-2 w-full focus:outline-none font-bold"
                />
              </div>

              <button
                type="submit"
                className="bg-papaya hover:bg-orange-500 text-obsidian font-bold py-2 px-5 rounded text-xs uppercase tracking-widest transition-colors font-sans"
              >
                Save Schedule Settings
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 7: Audit history */}
      {subTab === 'logs' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-obsidian-light pb-2">
            <History size={16} className="text-text-secondary" />
            <h2 className="font-silkscreen text-white text-xs uppercase tracking-wider">Administrative Security Audit Ledger</h2>
          </div>

          <div className="overflow-x-auto rounded-xl border border-obsidian-light font-mono bg-obsidian text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-obsidian-dark/70 text-text-secondary text-[10px] uppercase border-b border-obsidian-light">
                  <th className="py-2.5 px-4 w-40">UTC Timestamp</th>
                  <th className="py-2.5 px-4 w-48">Action Event</th>
                  <th className="py-2.5 px-4">Detailed Audit logs</th>
                  <th className="py-2.5 px-4 text-right pr-6 w-52 font-mono">Admin Operator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-obsidian-light/35">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-obsidian-dark/15">
                    <td className="py-2 px-4 text-text-secondary truncate">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2 px-4">
                      <span className="bg-marsala bg-opacity-15 border border-marsala/30 text-red-400 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-chalk font-mono text-[11px] leading-relaxed">
                      {log.details}
                    </td>
                    <td className="py-2 px-4 text-right pr-6 text-[10px] text-text-secondary truncate font-sans font-semibold">
                      {log.adminEmail}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
