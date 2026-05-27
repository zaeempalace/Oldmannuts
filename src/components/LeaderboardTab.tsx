/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Trophy, 
  Search, 
  HelpCircle, 
  Coins, 
  AlertCircle,
  TrendingUp,
  Award
} from 'lucide-react';
import { LeaderboardEntry } from '../types';

interface LeaderboardTabProps {
  leaderboard: LeaderboardEntry[];
  user: any;
  config: any;
  onRefresh: () => void;
}

export default function LeaderboardTab({ leaderboard, user, config, onRefresh }: LeaderboardTabProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const getDisplayUsername = (uname: string) => {
    if (uname.endsWith('***')) return uname;
    if (uname.length > 3) {
      return uname.substring(0, 3) + '***';
    }
    return uname.substring(0, 1) + '**';
  };

  // Filter entries
  const filteredLeaderboard = leaderboard.filter(entry => {
    return entry.username.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Find user's rank if linked
  const userThrillLinked = user?.thrillName;
  const loggedInEntry = userThrillLinked 
    ? leaderboard.find(entry => entry.username.toLowerCase() === userThrillLinked.toLowerCase())
    : null;

  // Render pod components
  const podWinners = leaderboard.slice(0, 3);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-8 pb-16 animate-fade-in">
      
      {/* Race Header Overview Card */}
      <div className="bg-gradient-to-r from-obsidian to-obsidian-light border border-obsidian-light p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-papaya/10 blur-[60px] pointer-events-none" />
        
        <div className="space-y-3 z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 bg-papaya/10 text-papaya border border-papaya/20 text-xs px-3 py-1 rounded font-bold font-mono">
            <Trophy size={14} className="animate-spin" /> ACTIVE WAGER RACE
          </div>
          <h1 className="font-silkscreen text-2xl sm:text-3.5xl text-white tracking-wide">
            $12,500 BI-WEEKLY WAGER RUN
          </h1>
          <p className="text-text-secondary text-xs sm:text-sm max-w-xl">
            Wager on Thrill using affiliate code <span className="text-papaya font-bold font-mono">OLDMAN</span>. 
            All games count 100%. Rankings update automatically every hour from our API.
          </p>
        </div>

        {/* Chrono Frame details */}
        <div className="bg-obsidian-dark border border-obsidian-light p-4 rounded-xl flex items-center justify-between gap-6 text-center shrink-0 z-10 w-full md:w-auto">
          <div>
            <span className="text-[10px] font-mono text-text-secondary block">CYCLE START</span>
            <span className="text-chalk text-xs font-bold font-mono">{config?.cycleStart || 'May 15, 2026'}</span>
          </div>
          <div className="h-8 w-[1px] bg-obsidian-light" />
          <div>
            <span className="text-[10px] font-mono text-text-secondary block">CYCLE ENDS</span>
            <span className="text-papaya text-xs font-extrabold font-mono">{config?.cycleEnd || 'May 29, 2026'}</span>
          </div>
          <div className="h-8 w-[1px] bg-obsidian-light" />
          <div>
            <span className="text-[10px] font-mono text-text-secondary block">BUDGET POOL</span>
            <span className="text-green-400 text-xs font-extrabold font-sans">${config?.totalRacePrizePool?.toLocaleString() || '12,500'}</span>
          </div>
        </div>
      </div>

      {/* Ranks Top 3 Podium Cards */}
      {podWinners.length > 0 && searchQuery === '' && (
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* 2nd place */}
          {podWinners[1] && (
            <div className="bg-obsidian border border-obsidian-light rounded-xl p-5 flex flex-col items-center justify-between text-center relative order-2 sm:order-1 pt-8">
              <div className="absolute top-3 left-3 font-silkscreen text-xs text-text-secondary font-bold">2ND</div>
              <div className="h-12 w-12 rounded-full bg-slate-400/10 border border-slate-400 text-slate-350 flex items-center justify-center font-bold text-lg mb-2">🥈</div>
              <div>
                <span className="font-mono text-white text-sm block font-semibold">
                  {getDisplayUsername(podWinners[1].username)}
                </span>
                <span className="text-[11px] font-mono text-text-secondary">
                  ${podWinners[1].xp.toLocaleString()} Wagered
                </span>
              </div>
              <div className="bg-slate-400/15 border border-slate-400/30 text-white font-bold text-xs mt-4 px-3.5 py-1.5 rounded w-full">
                {formatCurrency(podWinners[1].prize)} Cash Prize
              </div>
            </div>
          )}

          {/* 1st place */}
          {podWinners[0] && (
            <div className="bg-obsidian border-2 border-papaya rounded-xl p-6 flex flex-col items-center justify-between text-center relative order-1 sm:order-2 shadow-2xl scale-[1.05] z-10 pt-10">
              <div className="absolute top-3 left-1/2 -translate-x-1/2 font-silkscreen text-[11px] text-papaya font-bold tracking-widest flex items-center gap-1 shrink-0 bg-papaya/10 px-2.5 py-0.5 rounded-full border border-papaya/10">
                <Award size={12} className="animate-bounce" /> CHAMPION
              </div>
              <div className="h-16 w-16 rounded-full bg-papaya/15 border border-papaya text-papaya shadow-[0_0_15px_rgba(247,170,56,0.3)] flex items-center justify-center font-bold text-2xl mb-3">👑</div>
              <div>
                <span className="font-mono text-white text-base block font-bold tracking-wide">
                  {getDisplayUsername(podWinners[0].username)}
                </span>
                <span className="text-xs font-mono text-text-secondary">
                  ${podWinners[0].xp.toLocaleString()} Wagered
                </span>
              </div>
              <div className="bg-papaya text-obsidian font-extrabold text-sm mt-4 px-4 py-2 rounded shadow-md w-full">
                {formatCurrency(podWinners[0].prize)} Cash Prize
              </div>
            </div>
          )}

          {/* 3rd place */}
          {podWinners[2] && (
            <div className="bg-obsidian border border-obsidian-light rounded-xl p-5 flex flex-col items-center justify-between text-center relative order-3 pt-8">
              <div className="absolute top-3 left-3 font-silkscreen text-xs text-text-secondary font-bold">3RD</div>
              <div className="h-12 w-12 rounded-full bg-amber-750/10 border border-amber-600 text-amber-500 flex items-center justify-center font-bold text-lg mb-2">🥉</div>
              <div>
                <span className="font-mono text-white text-sm block font-semibold">
                  {getDisplayUsername(podWinners[2].username)}
                </span>
                <span className="text-[11px] font-mono text-text-secondary">
                  ${podWinners[2].xp.toLocaleString()} Wagered
                </span>
              </div>
              <div className="bg-amber-700/15 border border-amber-700/30 text-amber-500 font-bold text-xs mt-4 px-3.5 py-1.5 rounded w-full">
                {formatCurrency(podWinners[2].prize)} Cash Prize
              </div>
            </div>
          )}
        </section>
      )}

      {/* Personal Tracker Block (If logged in but not in top 3) */}
      {user && (
        <div className="bg-obsidian rounded-xl border border-obsidian-light/60 p-4 font-sans text-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <TrendingUp size={16} className="text-green-400" />
              <div>
                <span className="text-text-secondary block text-[10px] font-mono">YOUR THRILL ACCOUNT CONNECTION</span>
                <strong className="text-chalk text-sm truncate block">{user.thrillName || 'No connection verified'}</strong>
              </div>
            </div>
            
            {loggedInEntry ? (
              <div className="flex items-center gap-6 font-mono text-xs text-right">
                <div>
                  <span className="text-text-secondary text-[10px] block">CURRENT RANK</span>
                  <span className="text-papaya font-bold">#{loggedInEntry.rank} of {leaderboard.length}</span>
                </div>
                <div>
                  <span className="text-text-secondary text-[10px] block">YOUR CYCLE XP</span>
                  <span className="text-chalk font-bold">${loggedInEntry.xp.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-text-secondary text-[10px] block">PENDING REWARD</span>
                  <span className="text-green-400 font-semibold">{formatCurrency(loggedInEntry.prize)}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-text-secondary bg-obsidian-dark px-3 py-1.5 rounded border border-obsidian-light/40">
                <AlertCircle size={14} className="text-papaya shrink-0" />
                <span>You represent no active wager entries in this cycle's race. Start spinning on code <strong className="text-chalk">OLDMAN</strong> immediately to list!</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Table Segment */}
      <div className="space-y-4">
        {/* Search tool block */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
            <input
              type="text"
              placeholder="Filter leaderboard username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-obsidian-dark border border-obsidian-light text-chalk text-sm rounded-lg pl-9 pr-4 py-2 w-full focus:outline-none focus:border-papaya transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2 text-text-secondary text-xs">
            <HelpCircle size={14} />
            <span>Usernames are masked to respect player confidentiality. Only showing first 3 characters.</span>
          </div>
        </div>

        {/* Table layout */}
        <div className="overflow-x-auto rounded-xl border border-obsidian-light bg-obsidian text-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-obsidian-dark/70 text-text-secondary text-[11px] font-mono uppercase tracking-wider border-b border-obsidian-light">
                <th className="py-3 px-4 text-center w-16">Rank</th>
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4 text-right">XP (Wagered Pool)</th>
                <th className="py-3 px-4 text-right pr-6 w-32">Prize Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-light/40 font-mono text-xs">
              {filteredLeaderboard.length > 0 ? (
                filteredLeaderboard.map((entry, idx) => {
                  const isTopOne = entry.rank === 1;
                  const isTopThree = entry.rank <= 3;
                  
                  return (
                    <tr 
                      key={entry.id} 
                      className={`hover:bg-obsidian-dark/30 transition-colors ${
                        userThrillLinked && entry.username.toLowerCase() === userThrillLinked.toLowerCase()
                          ? 'bg-papaya/5 font-semibold text-papaya'
                          : ''
                      }`}
                    >
                      {/* Rank Column */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full font-bold text-xs ${
                          isTopOne
                            ? 'bg-papaya text-obsidian shadow' 
                            : entry.rank === 2
                            ? 'bg-slate-400 text-obsidian-dark'
                            : entry.rank === 3
                            ? 'bg-amber-600 text-chalk'
                            : 'bg-obsidian-dark text-text-secondary'
                        }`}>
                          {entry.rank}
                        </span>
                      </td>

                      {/* Username Column */}
                      <td className="py-3.5 px-4 font-medium text-chalk">
                        <div className="flex items-center gap-2">
                          <span className="font-sans">
                            {getDisplayUsername(entry.username)}
                          </span>
                          {userThrillLinked && entry.username.toLowerCase() === userThrillLinked.toLowerCase() && (
                            <span className="bg-papaya/10 border border-papaya/20 text-papaya text-[9px] font-sans font-bold uppercase rounded px-1 px-1.5 scale-90">
                              You
                            </span>
                          )}
                        </div>
                      </td>

                      {/* XP Column */}
                      <td className="py-3.5 px-4 text-right text-text-secondary font-mono">
                        ${entry.xp.toLocaleString()} XP
                      </td>

                      {/* Prize Column */}
                      <td className="py-3.5 px-4 text-right font-sans font-bold text-green-400 pr-6">
                        {formatCurrency(entry.prize)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-text-secondary font-sans text-xs">
                    No leaderboard wagers found matching search credentials.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
