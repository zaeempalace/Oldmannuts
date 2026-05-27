/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Coins, Tv, MessageSquare, ShieldAlert } from 'lucide-react';

interface AuthModalsProps {
  isOpen: boolean;
  type: 'login' | 'register';
  onClose: () => void;
  onSubmit: (type: 'login' | 'register', data: any) => Promise<void>;
  loading: boolean;
}

export default function AuthModals({ isOpen, type, onClose, onSubmit, loading }: AuthModalsProps) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [thrillName, setThrillName] = useState('');
  const [kickName, setKickName] = useState('');
  const [discordName, setDiscordName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      const payload: any = { email, password };
      if (type === 'register') {
        if (!username.trim()) {
          setErrorMsg("Display Username is compulsory.");
          return;
        }
        if (!thrillName.trim()) {
          setErrorMsg("Verification Thrill Casino username is compulsory to trace wagers!");
          return;
        }
        payload.username = username;
        payload.thrillName = thrillName;
        payload.kickName = kickName;
        payload.discordName = discordName;
      }

      await onSubmit(type, payload);
      // Clean forms
      setEmail('');
      setPassword('');
      setUsername('');
      setThrillName('');
      setKickName('');
      setDiscordName('');
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification Error during execution.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-dark/80 backdrop-blur-sm animate-fade-in font-sans text-xs">
      
      {/* Container Card */}
      <div className="w-full max-w-md bg-obsidian border border-obsidian-light/80 rounded-2xl shadow-2xl overflow-hidden relative">
        
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-papaya to-orange-500 h-1.5 w-full" />

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-white p-1 rounded-full hover:bg-obsidian-light/30 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <span className="font-silkscreen text-[11px] text-papaya tracking-widest font-bold">OLDMAN NUTS</span>
            <h2 className="text-xl font-bold font-sans text-white capitalize">
              {type === 'login' ? 'Sign Into VIP Account' : 'Register Community Account'}
            </h2>
            <p className="text-text-secondary text-xs">
              {type === 'login' 
                ? 'Unlock access to bi-weekly payout claims, leaderboards, and promotions.'
                : 'Join code OLDMAN affiliates community and track real-time level ups.'
              }
            </p>
          </div>

          {errorMsg && (
            <div className="bg-marsala/15 border border-marsala/40 text-red-400 p-3 rounded-lg flex items-start gap-2.5 font-mono">
              <ShieldAlert size={14} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Core credentials */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-text-secondary block uppercase">Email Address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="e.g. gambler@gmail.com"
                  className="bg-obsidian-dark border border-obsidian-light text-chalk rounded-md pl-9 pr-4 py-2 w-full focus:outline-none focus:border-papaya font-mono font-medium"
                />
              </div>
            </div>

            {type === 'register' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-text-secondary block uppercase">Display Username</label>
                <div className="relative">
                  <UserIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="e.g. lucky_guy_99"
                    className="bg-obsidian-dark border border-obsidian-light text-chalk rounded-md pl-9 pr-4 py-2 w-full focus:outline-none focus:border-papaya font-sans font-medium"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-text-secondary block uppercase">Secret Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="bg-obsidian-dark border border-obsidian-light text-chalk rounded-md pl-9 pr-4 py-2 w-full focus:outline-none focus:border-papaya font-mono"
                />
              </div>
            </div>

            {/* Connection IDs for Affiliation checking on registration */}
            {type === 'register' && (
              <div className="pt-2 border-t border-obsidian-light space-y-3">
                <div className="text-[9px] font-mono text-text-secondary tracking-widest block uppercase text-center mb-1">
                  AFFILIATION TRACKING CONNECTIONS
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-text-secondary block uppercase font-bold text-papaya">
                    Thrill.com Username *
                  </label>
                  <div className="relative">
                    <Coins size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-papaya" />
                    <input
                      type="text"
                      value={thrillName}
                      onChange={(e) => setThrillName(e.target.value)}
                      required
                      placeholder="Your casino wagering ID under OLDMAN code"
                      className="bg-obsidian-dark border border-papaya/30 text-chalk rounded-md pl-9 pr-4 py-2 w-full focus:outline-none focus:border-papaya font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono text-text-secondary block uppercase">Kick Name</label>
                    <div className="relative">
                      <Tv size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-secondary" />
                      <input
                        type="text"
                        value={kickName}
                        onChange={(e) => setKickName(e.target.value)}
                        placeholder="Kick chat login"
                        className="bg-obsidian-dark border border-obsidian-light text-chalk rounded-md pl-8 pr-3 py-1.5 w-full focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono text-text-secondary block uppercase">Discord ID</label>
                    <div className="relative">
                      <MessageSquare size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-secondary" />
                      <input
                        type="text"
                        value={discordName}
                        onChange={(e) => setDiscordName(e.target.value)}
                        placeholder="Tag (support#00)"
                        className="bg-obsidian-dark border border-obsidian-light text-chalk rounded-md pl-8 pr-3 py-1.5 w-full focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              id="auth-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full bg-papaya hover:bg-orange-500 disabled:bg-opacity-50 text-obsidian font-bold py-2.5 rounded text-sm uppercase tracking-wider transition-all shadow-md font-semibold mt-4"
            >
              {loading ? 'Transmitting credentials secure...' : type === 'login' ? 'Sign In Master' : 'Create Affiliate Account'}
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
