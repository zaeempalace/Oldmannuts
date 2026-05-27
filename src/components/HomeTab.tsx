/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Tv, 
  ExternalLink, 
  Send, 
  MessageSquare, 
  Twitter, 
  Mail, 
  Award, 
  TrendingUp, 
  Coins, 
  Gift, 
  Play, 
  Layers,
  ChevronRight,
  Upload,
  Camera,
  X
} from 'lucide-react';
import { COMMISSION_TIERS, MILESTONE_REWARDS } from '../types';
// @ts-ignore
import defaultAvatar from '../assets/images/regenerated_image_1779566121230.jpg';

interface HomeTabProps {
  setActiveTab: (tab: string) => void;
  onOpenRegister: () => void;
  user: any;
}

export default function HomeTab({ setActiveTab, onOpenRegister, user }: HomeTabProps) {
  const [activeClipId, setActiveClipId] = useState<'stream' | 'clip1' | 'clip2'>('stream');
  const [customAvatar, setCustomAvatar] = useState<string>(() => {
    return localStorage.getItem('oldmannuts_custom_avatar') || '';
  });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === 'string') {
          localStorage.setItem('oldmannuts_custom_avatar', event.target.result);
          setCustomAvatar(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === 'string') {
          localStorage.setItem('oldmannuts_custom_avatar', event.target.result);
          setCustomAvatar(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const clearCustomAvatar = (e: React.MouseEvent) => {
    e.stopPropagation();
    localStorage.removeItem('oldmannuts_custom_avatar');
    setCustomAvatar('');
  };

  const socialLinks = [
    { name: 'Kick Stream', url: 'https://kick.com/oldmannuts', handle: '@oldmannuts', icon: Tv, color: 'hover:border-green-500 hover:text-green-400' },
    { name: 'Thrill Casino', url: 'https://thrill.com/casino?r=OLDMAN', handle: 'Promo: OLDMAN', icon: Coins, color: 'hover:border-papaya hover:text-papaya' },
    { name: 'Telegram Channel', url: 'https://t.me/OLDMANNUTS', handle: '@OLDMANNUTS', icon: Send, color: 'hover:border-sky-500 hover:text-sky-450' },
    { name: 'Discord Guild', url: 'https://discord.gg/Y4uCvEBcPj', handle: 'Join Discord', icon: MessageSquare, color: 'hover:border-indigo-500 hover:text-indigo-400' },
    { name: 'Twitter/X', url: 'https://x.com/oldmannuts', handle: '@oldmannuts', icon: Twitter, color: 'hover:border-blue-450 hover:text-blue-400' },
    { name: 'Support Mail', url: 'mailto:oldmannuts@gmail.com', handle: 'oldmannuts@gmail.com', icon: Mail, color: 'hover:border-red-500 hover:text-red-400' },
  ];

  return (
    <div className="space-y-12 pb-16 animate-fade-in">
      
      {/* Hero Visual Banner Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-obsidian-light to-obsidian border border-obsidian-light/60 p-6 sm:p-10 flex flex-col lg:flex-row items-center gap-8 justify-between shadow-2xl">
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 h-56 w-56 rounded-full bg-papaya/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 h-36 w-36 rounded-full bg-marsala/15 blur-[60px] pointer-events-none" />

        <div className="max-w-2xl space-y-6 text-center lg:text-left z-10">
          <div className="flex flex-wrap justify-center lg:justify-start gap-3">
            <span className="bg-papaya/10 text-papaya border border-papaya/20 text-xs font-bold tracking-widest px-3.5 py-1 roundeduppercase">
              STAY NUTS
            </span>
            <div className="flex items-center gap-1.5 bg-obsidian border border-obsidian-light text-text-secondary text-xs px-3 py-1 rounded">
              <span>Platform Partner:</span>
              <span className="text-chalk font-semibold">Thrill.com</span>
            </div>
          </div>
          
          <h1 className="font-silkscreen text-3xl sm:text-5xl leading-tight text-white tracking-wide">
            EVOLVING THE <span className="text-papaya font-bold">AFFILIATE</span> SPACE
          </h1>
          
          <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
            More than just a gambling community, we’ve built a place where players actually get rewarded — 
            daily streams, massive leaderboards, giveaways, bonuses, and a <strong className="text-chalk">GENUINE VIP PROGRAM</strong> that keeps growing every single week.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            {!user ? (
              <button
                onClick={onOpenRegister}
                className="w-full sm:w-auto bg-papaya hover:bg-orange-500 text-obsidian font-bold text-sm px-8 py-3 rounded shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                Create Account & Claim VIP
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('leaderboard')}
                className="w-full sm:w-auto bg-papaya hover:bg-orange-500 text-obsidian font-bold text-sm px-8 py-3 rounded shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                View $12.5k Leaderboard Race
              </button>
            )}
            
            <a 
              href="https://thrill.com/casino?r=OLDMAN" 
              target="_blank" 
              rel="noreferrer" 
              className="w-full sm:w-auto border border-obsidian-light hover:border-text-secondary bg-obsidian-dark text-chalk font-semibold text-sm px-6 py-3 rounded flex items-center justify-center gap-2 transition-all"
            >
              Sign Up with code <span className="text-papaya font-bold font-mono">OLDMAN</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Hero Image Block */}
        <div className="relative flex flex-col items-center justify-center w-full max-w-[280px] sm:max-w-[340px] z-10 shrink-0">
          {/* Hidden File Input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />

          {/* Pulsing Backing Glow - Papaya / Amber representing their color scheme */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-papaya/30 to-marsala/25 blur-[35px] opacity-80 animate-pulse pointer-events-none" />
          
          {/* Main Character Avatar with Golden Glow Ring */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative w-56 h-56 sm:w-72 sm:h-72 rounded-full border-4 ${
              isDragging ? 'border-dashed border-green-450 bg-obsidian-light/80' : 'border-papaya border-solid bg-obsidian-dark'
            } shadow-[0_0_30px_rgba(247,170,56,0.55)] overflow-hidden z-10 hover:scale-105 transition-transform duration-500 cursor-pointer group select-none`}
            title="Click or drag-and-drop to set your exact character image file"
          >
            <img 
              src={customAvatar || defaultAvatar} 
              alt="Old Man Nuts - Official" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover scale-110 translate-y-2 group-hover:scale-115 transition-transform duration-500 filter contrast-125 brightness-95 saturate-120"
              onError={(e) => {
                (e.target as HTMLImageElement).src = defaultAvatar;
              }}
            />
            {/* Fine Gradient Shade Cover to bring in the deep obsidian theme */}
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian-dark/95 via-transparent to-transparent opacity-60 pointer-events-none" />

            {/* Hover/Drag visual overlays for upload prompt */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center bg-obsidian/85 gap-2 transition-opacity duration-300 ${
              isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}>
              {isDragging ? (
                <>
                  <Upload size={32} className="text-green-400 animate-bounce" />
                  <span className="text-chalk text-xs font-bold font-sans uppercase tracking-widest text-center px-4">
                    Drop Exact Image File Here
                  </span>
                </>
              ) : (
                <>
                  <Camera size={28} className="text-papaya animate-pulse" />
                  <span className="text-chalk text-[11px] font-bold font-sans uppercase tracking-widest text-center px-4">
                    {customAvatar ? 'Update Exact Image' : 'Drop or Click to Set Character Image'}
                  </span>
                  <span className="text-text-secondary text-[9px] font-mono mt-1 text-center px-4">
                    Supports JPG, PNG, WEBP
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Floating Badges inspired by their cigar, chips, and whiskey artwork */}
          {/* 1. Cigar & Smoke Badge */}
          <div className="absolute -top-1 -right-1 bg-obsidian-dark border border-papaya/40 text-chalk h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center text-base sm:text-lg shadow-[0_0_15px_rgba(247,170,56,0.30)] z-20 hover:scale-110 transition-transform cursor-help" title="Stay Smooth">
            🚬
          </div>

          {/* 2. Casino Poker Chips Badge */}
          <div className="absolute top-1/2 -left-4 bg-obsidian-dark border border-papaya/40 text-papaya h-9 w-9 sm:h-11 sm:w-11 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(247,170,56,0.30)] z-20 hover:scale-110 transition-transform cursor-help" title="High Roller Action">
            <Coins size={18} className="animate-spin-slow text-papaya" />
          </div>

          {/* 3. Whiskey Glass Badge */}
          <div className="absolute bottom-6 -right-3 bg-obsidian-dark border border-papaya/40 text-chalk h-9 w-9 sm:h-11 sm:w-11 rounded-full flex items-center justify-center text-sm sm:text-base shadow-[0_0_15px_rgba(247,170,56,0.30)] z-20 hover:scale-110 transition-transform cursor-help" title="Always VIP">
            🥃
          </div>

          {/* Partner Overlay badge */}
          <div className="absolute -bottom-4 bg-obsidian border-2 border-papaya text-chalk px-4 py-1.5 rounded-full text-[11px] font-bold font-sans tracking-widest uppercase shadow-xl flex items-center gap-2 z-20">
            <span className="inline-block h-2 w-2 bg-green-400 rounded-full animate-ping" />
            <span className="text-papaya">Thrill</span> Official Partner
          </div>

          {/* Clear Button (Reset to Default) if a custom avatar is set */}
          {customAvatar && (
            <button 
              onClick={clearCustomAvatar}
              className="absolute -bottom-12 flex items-center gap-1.5 text-[10px] text-zinc-500 hover:text-papaya font-semibold font-mono uppercase bg-obsidian-dark border border-obsidian-light hover:border-papaya/30 px-3 py-1 rounded transition-colors z-20 shadow-md"
              title="Reset avatar to default portrait"
            >
              <X size={10} /> Reset Default
            </button>
          )}
        </div>
      </section>

      {/* Thrill Partner Badge Row */}
      <div className="relative flex justify-center items-center py-2">
        <img 
          src="/thrill-partner-badge.png" 
          alt="Thrill Official Partner" 
          referrerPolicy="no-referrer"
          className="max-h-16 object-contain opacity-90 hover:opacity-100 transition-opacity"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>

      {/* Embedded Stream Elements / Visual Interactive Player */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-obsidian-light pb-3">
          <div className="flex items-center gap-2.5">
            <Tv size={20} className="text-green-400" />
            <h2 className="font-silkscreen text-lg sm:text-xl tracking-wider text-chalk">
              ONSITE STREAM CLIPS & REELS
            </h2>
          </div>
          
          {/* Controls */}
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveClipId('stream')}
              className={`flex-1 sm:flex-initial text-xs font-mono px-3 py-1.5 rounded uppercase font-semibold transition-all ${
                activeClipId === 'stream' 
                  ? 'bg-green-500/10 text-green-400 border border-green-500/30' 
                  : 'bg-obsidian border border-obsidian-light text-text-secondary hover:text-chalk'
              }`}
            >
              Live Video Preview
            </button>
            <button
              onClick={() => setActiveClipId('clip1')}
              className={`flex-1 sm:flex-initial text-xs font-mono px-3 py-1.5 rounded uppercase font-semibold transition-all ${
                activeClipId === 'clip1' 
                  ? 'bg-papaya/10 text-papaya border border-papaya/30' 
                  : 'bg-obsidian border border-obsidian-light text-text-secondary hover:text-chalk'
              }`}
            >
              12,000x Max Win
            </button>
            <button
              onClick={() => setActiveClipId('clip2')}
              className={`flex-1 sm:flex-initial text-xs font-mono px-3 py-1.5 rounded uppercase font-semibold transition-all ${
                activeClipId === 'clip2' 
                  ? 'bg-papaya/10 text-papaya border border-papaya/30' 
                  : 'bg-obsidian border border-obsidian-light text-text-secondary hover:text-chalk'
              }`}
            >
              Plinko $25k Drop
            </button>
          </div>
        </div>

        {/* Video Screen container */}
        <div className="aspect-video w-full rounded-xl bg-obsidian-dark border border-obsidian-light overflow-hidden relative shadow-2xl group">
          {activeClipId === 'stream' ? (
            <>
              {/* Live Kick Stream Simulation or actual embed */}
              <iframe
                src="https://player.kick.com/oldmannuts?muted=true&autoplay=false"
                height="100%"
                width="100%"
                className="w-full h-full border-0"
                allowFullScreen={true}
              />
              <div className="absolute top-4 left-4 bg-obsidian-dark/90 border border-obsidian-light/50 px-3 py-1 rounded text-[10px] font-mono text-text-secondary flex items-center gap-1.5 pointer-events-none">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                <span>KICK STREAM PLAYER</span>
              </div>
            </>
          ) : activeClipId === 'clip1' ? (
            <div className="w-full h-full relative flex flex-col justify-center items-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-marsala/45 via-obsidian-dark to-obsidian-dark text-center p-6">
              <span className="font-silkscreen text-papaya font-bold text-2xl mb-2 sm:text-4xl text-shadow">12,500x MAX WIN!</span>
              <p className="text-text-secondary max-w-md text-xs sm:text-sm mb-6 font-mono">
                Thrill Casino - Cleocatra slot. Absolute insanity on a $4.00 spin amount!
              </p>
              <a 
                href="https://kick.com/oldmannuts" 
                target="_blank" 
                rel="noreferrer"
                className="bg-green-500 hover:bg-green-600 text-obsidian font-bold px-5 py-2.5 rounded-md text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-transform hover:-translate-y-0.5"
              >
                <Play size={14} fill="currentColor" /> WATCH REPLAY ON KICK.COM
              </a>
            </div>
          ) : (
            <div className="w-full h-full relative flex flex-col justify-center items-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-papaya/20 via-obsidian-dark to-obsidian-dark text-center p-6">
              <span className="font-silkscreen text-white font-bold text-2xl mb-2 sm:text-4xl">$25,000 PLINKO DROP!</span>
              <p className="text-text-secondary max-w-md text-xs sm:text-sm mb-6 font-mono">
                OldManNuts hits the mythical 1000x bucket with a max ball config. The chat melted down!
              </p>
              <a 
                href="https://kick.com/oldmannuts" 
                target="_blank" 
                rel="noreferrer"
                className="bg-green-500 hover:bg-green-600 text-obsidian font-bold px-5 py-2.5 rounded-md text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-transform hover:-translate-y-0.5"
              >
                <Play size={14} fill="currentColor" /> WATCH MOMENT CLIP
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Core Features Quick Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-b from-obsidian to-obsidian-dark border border-obsidian-light p-5 rounded-xl space-y-3">
          <div className="h-10 w-10 flex items-center justify-center rounded bg-papaya/15 border border-papaya/30 text-papaya">
            <Award size={20} />
          </div>
          <h3 className="font-silkscreen text-sm tracking-wide text-chalk uppercase">
            Leaderboard Races
          </h3>
          <p className="text-text-secondary text-xs leading-relaxed">
            Every two weeks, the top wagers on Thrill compete for massive cash rewards. Over 1st to 25th ranks split our generous $12,500 prize pool directly.
          </p>
          <button 
            onClick={() => setActiveTab('leaderboard')} 
            className="text-decor-none text-papaya hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            Check Wager Rankings <ChevronRight size={14} />
          </button>
        </div>

        <div className="bg-gradient-to-b from-obsidian to-obsidian-dark border border-obsidian-light p-5 rounded-xl space-y-3">
          <div className="h-10 w-10 flex items-center justify-center rounded bg-red-400/10 border border-red-500/20 text-red-400">
            <TrendingUp size={20} />
          </div>
          <h3 className="font-silkscreen text-sm tracking-wide text-chalk uppercase">
            VIP Milestone Rewards
          </h3>
          <p className="text-text-secondary text-xs leading-relaxed">
            The more volume you wager, the higher you level up. Each level unlocks one-time legacy bonuses paid in crypto or cash, from $10 up to $1,000 cash.
          </p>
          <button 
            onClick={() => setActiveTab('wager-target')} 
            className="text-decor-none text-papaya hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            Explore VIP Milestones <ChevronRight size={14} />
          </button>
        </div>

        <div className="bg-gradient-to-b from-obsidian to-obsidian-dark border border-obsidian-light p-5 rounded-xl space-y-3">
          <div className="h-10 w-10 flex items-center justify-center rounded bg-green-400/10 border border-green-500/20 text-green-400">
            <Gift size={20} />
          </div>
          <h3 className="font-silkscreen text-sm tracking-wide text-chalk uppercase">
            Hourly & Daily Raffles
          </h3>
          <p className="text-text-secondary text-xs leading-relaxed">
            We provide exclusive wager-qualified giveaways and free chat raffles. Gain seats dynamically by wagering or following the Kick and Discord.
          </p>
          <button 
            onClick={() => setActiveTab('raffles')} 
            className="text-decor-none text-papaya hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            Browse Active Giveaways <ChevronRight size={14} />
          </button>
        </div>
      </section>

      {/* Rewards Matrix Summary Tabs */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Milestone milestones program summary */}
        <div className="bg-obsidian rounded-xl border border-obsidian-light/80 p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-papaya animate-bounce" />
            <span className="font-silkscreen text-sm tracking-wider text-chalk">
              TIERED VIP UP REWARDS
            </span>
          </div>
          <p className="text-text-secondary text-xs">
            Unlock cash rewards the second your legacy wager accounts hit these key volume milestones. Completely non-decaying progress tracker.
          </p>

          <div className="space-y-2">
            {MILESTONE_REWARDS.slice(0, 4).map((m, i) => (
              <div key={i} className="flex justify-between items-center text-xs border-b border-obsidian-light pb-2">
                <span className="font-mono text-chalk font-semibold">{(m.threshold / 1000).toLocaleString()}k XP Milestones</span>
                <div className="flex items-center gap-2">
                  <span className="text-text-secondary bg-obsidian-light px-2 py-0.5 rounded text-[10px]">Prizes</span>
                  <span className="text-papaya font-bold">+ ${m.prize} Cash</span>
                </div>
              </div>
            ))}
            <div className="text-center pt-2">
              <button 
                onClick={() => setActiveTab('wager-target')} 
                className="text-[11px] font-mono hover:underline text-papaya text-opacity-80 hover:text-opacity-100"
              >
                View all Higher tier milestones up to $1,000 (5,000k XP)
              </button>
            </div>
          </div>
        </div>

        {/* Bi-weekly payroll rates */}
        <div className="bg-obsidian rounded-xl border border-obsidian-light/80 p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Coins size={18} className="text-green-400" />
            <span className="font-silkscreen text-sm tracking-wider text-chalk">
              BI-WEEKLY COMMISSION RATE DECK
            </span>
          </div>
          <p className="text-text-secondary text-xs">
            Rates are reset bi-weekly with cash payouts wired directly on the 1st and 15th of each month based on cycle XP counts.
          </p>

          <div className="space-y-2">
            {COMMISSION_TIERS.slice(0, 4).map((tier, i) => (
              <div key={i} className="flex justify-between items-center text-xs border-b border-obsidian-light pb-2">
                <span className="font-mono text-chalk font-semibold">{(tier.threshold / 1000).toLocaleString()}k+ Wagered</span>
                <span className="text-green-400 font-extrabold">{tier.rate}% Rate Tier Cash</span>
              </div>
            ))}
            <div className="text-center pt-2">
              <button 
                onClick={() => setActiveTab('wager-target')} 
                className="text-[11px] font-mono hover:underline text-papaya text-opacity-80 hover:text-opacity-100"
              >
                Read top rates up to 75% Commission (1M+ XP)
              </button>
            </div>
          </div>
        </div>

      </section>

      {/* Social Footing Directory */}
      <section className="space-y-4">
        <h3 className="font-silkscreen text-center text-xs tracking-widest text-text-secondary uppercase">
          CONNECT & ACTIVATE REWARDS DIRECTLY
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {socialLinks.map((social, idx) => {
            const Icon = social.icon;
            return (
              <a
                key={idx}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className={`bg-obsidian border border-obsidian-light p-3 rounded-lg flex flex-col items-center justify-center text-center transition-all ${social.color} hover:scale-[1.02] shadow`}
              >
                <Icon size={20} className="mb-2" />
                <span className="text-chalk text-xs font-semibold truncate w-full">{social.name}</span>
                <span className="text-text-secondary text-[10px] truncate w-full mt-0.5">{social.handle}</span>
              </a>
            );
          })}
        </div>
      </section>

    </div>
  );
}
