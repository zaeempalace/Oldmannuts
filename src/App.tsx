/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import HomeTab from './components/HomeTab';
import LeaderboardTab from './components/LeaderboardTab';
import RafflesTab from './components/RafflesTab';
import WagerTargetTab from './components/WagerTargetTab';
import PromotionsTab from './components/PromotionsTab';
import AccountTab from './components/AccountTab';
import AdminTab from './components/AdminTab';
import AuthModals from './components/AuthModals';

import { 
  User, 
  LeaderboardEntry, 
  Promotion, 
  Raffle, 
  Payout, 
  AuditLog, 
  SystemConfig 
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [user, setUser] = useState<User | null>(null);
  
  // Database states loaded from server
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [config, setConfig] = useState<SystemConfig | null>(null);

  // Modal triggering states
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalType, setAuthModalType] = useState<'login' | 'register'>('login');
  const [authLoading, setAuthLoading] = useState(false);
  const [loadingClaimId, setLoadingClaimId] = useState<string | null>(null);
  const [loadingPromoId, setLoadingPromoId] = useState<string | null>(null);
  const [loadingRaffleId, setLoadingRaffleId] = useState<string | null>(null);

  // Check persistent session on boot
  useEffect(() => {
    const savedUser = localStorage.getItem('oldmannuts_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
      } catch (err) {
        console.error("Stale session credentials discarded", err);
        localStorage.removeItem('oldmannuts_user');
      }
    }
    
    // Core data fetch
    fetchCoreData();
  }, []);

  // Fetch admin logs if user admin state shifts
  useEffect(() => {
    if (user?.isAdmin) {
      fetchAdminData();
    }
  }, [user]);

  const fetchCoreData = async () => {
    try {
      // 1. Leaderboard wagers
      const lbRes = await fetch(`/api/leaderboard?adminMode=${user?.isAdmin ? 'true' : 'false'}&thrillName=${user?.thrillName || ''}`);
      if (lbRes.ok) {
        const data = await lbRes.json();
        setLeaderboard(data);
      }

      // 2. Promotions Campaigns
      const promoRes = await fetch('/api/promotions');
      if (promoRes.ok) {
        const data = await promoRes.json();
        setPromotions(data);
      }

      // 3. Raffles Drawings
      const raffleRes = await fetch('/api/raffles');
      if (raffleRes.ok) {
        const data = await raffleRes.json();
        setRaffles(data);
      }

      // 4. Payout ledgers
      const payoutRes = await fetch('/api/payouts');
      if (payoutRes.ok) {
        const data = await payoutRes.json();
        setPayouts(data);
      }

      // 5. Config files
      const configRes = await fetch('/api/config');
      if (configRes.ok) {
        const data = await configRes.json();
        setConfig(data);
      }
    } catch (err) {
      console.error("Failed executing synchronization, falling back to local simulation", err);
    }
  };

  const fetchAdminData = async () => {
    try {
      const usersRes = await fetch('/api/users');
      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(data);
      }

      const logsRes = await fetch('/api/audit-logs');
      if (logsRes.ok) {
        const data = await logsRes.json();
        setAuditLogs(data);
      }
    } catch (err) {
      console.error("Administrative secure fetch failed:", err);
    }
  };

  // Auth Operations
  const handleAuthSubmit = async (type: 'login' | 'register', payload: any) => {
    setAuthLoading(true);
    try {
      const endpoint = type === 'login' ? '/api/auth/login' : '/api/auth/register';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Authentication error occurred.');
      }

      const { user: authedUser } = await res.json();
      setUser(authedUser);
      localStorage.setItem('oldmannuts_user', JSON.stringify(authedUser));
      setAuthModalOpen(false);
      
      // Re-fetch rankings in case they differ (Admin mask check)
      fetchCoreData();
    } catch (err: any) {
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('oldmannuts_user');
    setActiveTab('home');
    fetchCoreData(); // trigger public masks refetch again
  };

  const handleUpdateProfile = async (profileData: Partial<User>) => {
    if (!user) return;
    try {
      const res = await fetch('/api/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, ...profileData })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Profile update failed.');
      }

      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      localStorage.setItem('oldmannuts_user', JSON.stringify(updatedUser));
      fetchCoreData();
      if (user.isAdmin) fetchAdminData();
    } catch (err: any) {
      throw err;
    }
  };

  // Claim Rewards
  const handleClaimReward = async (type: 'milestone' | 'commission', threshold?: number) => {
    if (!user) return;
    setLoadingClaimId(type === 'milestone' ? `milestone-${threshold}` : 'commission');
    try {
      const res = await fetch('/api/payouts/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          type,
          milestoneThreshold: threshold
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Claim transaction rejected.');
      }

      await fetchCoreData();
    } catch (err: any) {
      throw err;
    } finally {
      setLoadingClaimId(null);
    }
  };

  // Opt-in Campaigns
  const handleJoinPromotion = async (promoId: string) => {
    if (!user) return;
    setLoadingPromoId(promoId);
    try {
      const res = await fetch(`/api/promotions/${promoId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Promortion registration declined.');
      }

      await fetchCoreData();
    } catch (err: any) {
      throw err;
    } finally {
      setLoadingPromoId(null);
    }
  };

  // Claim Raffles Seat
  const handleJoinRaffle = async (raffleId: string) => {
    if (!user) return;
    setLoadingRaffleId(raffleId);
    try {
      const res = await fetch(`/api/raffles/${raffleId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.id,
          username: user.username
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Giveaway entry failed.');
      }

      await fetchCoreData();
    } catch (err: any) {
      throw err;
    } finally {
      setLoadingRaffleId(null);
    }
  };

  // Admin Actions
  const handleUpdateConfig = async (data: Partial<SystemConfig>) => {
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        await fetchCoreData();
        await fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleManageLeaderboard = async (username: string, xp: number) => {
    try {
      const res = await fetch('/api/leaderboard/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, xp })
      });
      if (res.ok) {
        await fetchCoreData();
        await fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveLeaderboard = async (id: string) => {
    try {
      const res = await fetch(`/api/leaderboard/manage/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        await fetchCoreData();
        await fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSavePromotion = async (data: any) => {
    try {
      const res = await fetch('/api/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        await fetchCoreData();
        await fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePromotion = async (id: string) => {
    try {
      const res = await fetch(`/api/promotions/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        await fetchCoreData();
        await fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveRaffle = async (data: any) => {
    try {
      const res = await fetch('/api/raffles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        await fetchCoreData();
        await fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDrawRaffle = async (id: string) => {
    try {
      const res = await fetch(`/api/raffles/${id}/draw`, {
        method: 'POST'
      });
      if (res.ok) {
        await fetchCoreData();
        await fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRaffle = async (id: string) => {
    try {
      const res = await fetch(`/api/raffles/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        await fetchCoreData();
        await fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdatePayoutStatus = async (id: string, status: 'pending' | 'approved' | 'paid') => {
    try {
      const res = await fetch('/api/payouts/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        await fetchCoreData();
        await fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateUser = async (id: string, data: Partial<User>) => {
    try {
      const res = await fetch('/api/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data })
      });
      if (res.ok) {
        await fetchCoreData();
        await fetchAdminData();
        
        // If updating the active user's admin properties manually
        if (user && user.id === id) {
          const updated = { ...user, ...data };
          setUser(updated);
          localStorage.setItem('oldmannuts_user', JSON.stringify(updated));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-dark flex flex-col text-chalk">
      
      {/* Navigation Layer */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
        onOpenLogin={() => {
          setAuthModalType('login');
          setAuthModalOpen(true);
        }}
        onOpenRegister={() => {
          setAuthModalType('register');
          setAuthModalOpen(true);
        }}
      />

      {/* Main Container Workspace */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 pb-20">
        
        {activeTab === 'home' && (
          <HomeTab 
            setActiveTab={setActiveTab} 
            onOpenRegister={() => {
              setAuthModalType('register');
              setAuthModalOpen(true);
            }} 
            user={user}
          />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardTab
            leaderboard={leaderboard}
            user={user}
            config={config}
            onRefresh={fetchCoreData}
          />
        )}

        {activeTab === 'raffles' && (
          <RafflesTab
            raffles={raffles}
            user={user}
            onJoinRaffle={handleJoinRaffle}
            loadingRaffleId={loadingRaffleId}
          />
        )}

        {activeTab === 'wager-target' && (
          <WagerTargetTab
            user={user}
            onClaimReward={handleClaimReward}
            loadingClaim={loadingClaimId}
            payouts={payouts}
          />
        )}

        {activeTab === 'promotions' && (
          <PromotionsTab
            promotions={promotions}
            user={user}
            onJoinPromotion={handleJoinPromotion}
            loadingPromoId={loadingPromoId}
          />
        )}

        {activeTab === 'account' && user && (
          <AccountTab
            user={user}
            onUpdateProfile={handleUpdateProfile}
            onClaimReward={handleClaimReward}
            loadingClaim={loadingClaimId}
            payouts={payouts}
          />
        )}

        {activeTab === 'admin' && user?.isAdmin && (
          <AdminTab
            leaderboard={leaderboard}
            promotions={promotions}
            raffles={raffles}
            payouts={payouts}
            users={users}
            auditLogs={auditLogs}
            config={config}
            onRefresh={() => {
              fetchCoreData();
              fetchAdminData();
            }}
            onUpdateConfig={handleUpdateConfig}
            onManageLeaderboard={handleManageLeaderboard}
            onRemoveLeaderboard={handleRemoveLeaderboard}
            onSavePromotion={handleSavePromotion}
            onDeletePromotion={handleDeletePromotion}
            onSaveRaffle={handleSaveRaffle}
            onDrawRaffle={handleDrawRaffle}
            onDeleteRaffle={handleDeleteRaffle}
            onUpdatePayoutStatus={handleUpdatePayoutStatus}
            onUpdateUser={handleUpdateUser}
          />
        )}

      </main>

      {/* Authentication modals popup */}
      <AuthModals
        isOpen={authModalOpen}
        type={authModalType}
        onClose={() => setAuthModalOpen(false)}
        onSubmit={handleAuthSubmit}
        loading={authLoading}
      />

      {/* Footer copyright */}
      <footer className="bg-obsidian border-t border-obsidian-light py-6 text-center text-text-secondary font-mono text-[10px]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            &copy; 2026 <span className="text-papaya font-bold font-sans text-xs">OldManNuts.com</span>. All rights reserved. STAY NUTS!
          </div>
          <div className="flex gap-4">
            <a href="https://kick.com/oldmannuts" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">KICK</a>
            <a href="https://thrill.com/casino?r=OLDMAN" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">THRILL AFFILIATES</a>
            <a href="https://discord.gg/Y4uCvEBcPj" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">DISCORD SUPPORT</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
