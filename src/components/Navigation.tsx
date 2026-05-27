/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Home, 
  Trophy, 
  Gift, 
  Target, 
  Megaphone, 
  User as UserIcon, 
  Settings, 
  LogIn, 
  LogOut, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { User } from '../types';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User | null;
  onLogout: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

export default function Navigation({
  activeTab,
  setActiveTab,
  user,
  onLogout,
  onOpenLogin,
  onOpenRegister,
}: NavigationProps) {
  
  const menuItems = [
    { id: 'home', label: 'HOME', icon: Home },
    { id: 'leaderboard', label: 'RACE LEADERBOARD', icon: Trophy, accent: true },
    { id: 'raffles', label: 'DAILY RAFFLES', icon: Gift },
    { id: 'wager-target', label: 'WAGER TARGET & XP', icon: Target },
    { id: 'promotions', label: 'ACTIVE PROMOTIONS', icon: Megaphone },
  ];

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-obsidian-light bg-obsidian-dark/95 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div 
            onClick={() => setActiveTab('home')} 
            className="flex items-center gap-2 cursor-pointer group"
          >
            {/* Logo fallback & main container */}
            <div className="relative flex items-center">
              <img 
                src="/oldmannuts-logo.png" 
                alt="Old Man Nuts" 
                className="h-10 sm:h-12 object-contain hidden xs:block"
                onError={(e) => {
                  // Fallback to high quality text-art if image isn't loaded in some containers
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="font-silkscreen text-lg sm:text-2xl text-papaya select-none tracking-wider font-bold drop-shadow-[0_2px_4px_rgba(247,170,56,0.3)]">
                OLDMAN<span className="text-chalk">NUTS</span>
              </span>
            </div>
          </div>
          
          {/* Live Kick Stream Badge */}
          <a 
            href="https://kick.com/oldmannuts" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-1.5 bg-green-500/15 border border-green-500/30 text-green-400 font-mono text-xs px-2 py-0.5 rounded-full hover:bg-green-500/30 transition-all shadow-[0_0_10px_rgba(34,197,94,0.1)]"
          >
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="hidden sm:inline">KICK</span> LURK LIVE
          </a>
        </div>

        {/* Auth controls & external direct play link */}
        <div className="flex items-center gap-3">
          <a 
            href="https://thrill.com/casino?r=OLDMAN" 
            target="_blank" 
            rel="noreferrer" 
            className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-papaya to-orange-500 hover:from-orange-500 hover:to-papaya text-obsidian bg-size-200 font-bold px-4 py-1.5 rounded text-sm transition-all duration-300 shadow-[0_0_15px_rgba(247,170,56,0.25)] hover:shadow-[0_0_20px_rgba(247,170,56,0.4)]"
          >
            PLAY ON THRILL <ExternalLink size={14} className="stroke-[3px]" />
          </a>

          {user ? (
            <div className="flex items-center gap-2">
              <button
                id="view-account-btn"
                onClick={() => setActiveTab('account')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-all ${
                  activeTab === 'account' 
                    ? 'bg-papaya/20 text-papaya border border-papaya/40' 
                    : 'bg-obsidian hover:bg-obsidian-light text-chalk border border-obsidian-light'
                }`}
              >
                <UserIcon size={16} />
                <span className="max-w-[100px] truncate hidden md:inline">{user.username}</span>
                {user.isAdmin && (
                  <span className="bg-marsala bg-opacity-70 text-chalk text-[10px] px-1.5 py-0.5 rounded uppercase font-semibold">
                    Staff
                  </span>
                )}
              </button>

              {user.isAdmin && (
                <button
                  id="view-admin-btn"
                  onClick={() => setActiveTab('admin')}
                  className={`p-1.5 rounded transition-all ${
                    activeTab === 'admin' 
                      ? 'bg-marsala bg-opacity-20 text-red-400 border border-marsala' 
                      : 'bg-obsidian hover:bg-obsidian-light text-text-secondary border border-obsidian-light'
                  }`}
                  title="Admin Settings Panel"
                >
                  <Settings size={18} />
                </button>
              )}

              <button
                onClick={onLogout}
                className="p-1.5 text-text-secondary hover:text-marsala rounded bg-obsidian-light bg-opacity-30 hover:bg-opacity-80 transition-all border border-obsidian-light"
                title="Log Out Account"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenLogin}
                className="text-text-secondary hover:text-chalk text-sm px-3 py-1.5 transition-colors font-medium"
              >
                Sign In
              </button>
              <button
                onClick={onOpenRegister}
                className="bg-obsidian-light hover:bg-obsidian text-chalk border border-obsidian-light shadow-md px-3.5 py-1.5 rounded text-sm transition-all font-semibold"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Subnavigation Tab-Bar for responsive layout */}
      <div className="w-full bg-obsidian border-b border-obsidian-light overflow-x-auto no-scrollbar scroll-smooth">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-1">
          <nav className="flex items-center gap-1 sm:gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  id={`nav-tab-${item.id}`}
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 sm:px-5 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border-b-2 relative ${
                    isActive
                      ? 'text-papaya border-papaya bg-obsidian-dark/40 font-bold'
                      : 'text-text-secondary border-transparent hover:text-chalk hover:border-text-secondary/30'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-papaya animate-pulse' : ''} />
                  <span>{item.label}</span>
                  {item.accent && (
                    <span className="absolute top-1 sm:top-1.5 right-1 bg-papaya text-obsidian text-[8px] font-extrabold px-1 rounded-full animate-bounce scale-90">
                      $12k
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
          
          <div className="hidden lg:flex items-center gap-4 text-xs font-mono text-text-secondary">
            <span>Cycle Ends: <span className="text-papaya font-semibold font-sans">6 Days</span></span>
            <div className="h-3 w-[1px] bg-obsidian-light" />
            <span>Prize Pool: <span className="text-green-400 font-semibold font-sans">$12,500</span></span>
          </div>
        </div>
      </div>
    </>
  );
}
