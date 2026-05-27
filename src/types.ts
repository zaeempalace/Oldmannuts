/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  email: string;
  username: string; // display name
  thrillName: string; // connected Thrill platform username
  kickName: string; // Kick stream platform username
  discordName: string; // Discord username
  xp: number; // Current XP for commissions (wagered in cycle)
  totalXp: number; // Lifetime total XP for milestone rewards
  level: number; // Calculated or overridden level
  joinedAt: string;
  isAdmin?: boolean;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  xp: number;
  prize: number;
  rank: number;
  manuallyAdded?: boolean;
}

export type PromotionType = 'slot-hunt' | 'challenge' | 'wager-race' | 'bonus-hunt' | 'tournament';

export interface Promotion {
  id: string;
  title: string;
  type: PromotionType;
  slotName?: string;
  imageIcon?: string; // Icon or game image URL
  desc: string;
  reward: string;
  status: 'active' | 'completed' | 'draft';
  targetXp?: number;
  participantsCount: number;
  joinedUsers: string[]; // List of user IDs
  createdAt: string;
}

export interface Raffle {
  id: string;
  title: string;
  prize: string;
  entryRequirement: string;
  wagerRequired: number; // XP threshold in cycle to enter
  slotsMax: number;
  slotsFilled: number;
  status: 'active' | 'drawn' | 'draft';
  endAt: string;
  winners: string[]; // Usernames or User display names
  participants: { userId: string; username: string }[];
  createdAt: string;
}

export interface Payout {
  id: string;
  userId: string;
  userEmail: string;
  username: string;
  thrillName: string;
  amount: number;
  period: string; // e.g. "May 15 - May 30, 2026" or "Lifetime Milestone"
  status: 'pending' | 'approved' | 'paid';
  type: 'milestone' | 'commission';
  details: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  timestamp: string;
  details: string;
  adminEmail: string;
}

export interface SystemConfig {
  thrillApiKey: string;
  keyLastRotated: string;
  cycleStart: string; // Start date of current bi-weekly wager race
  cycleEnd: string; // End date
  totalRacePrizePool: number; // e.g., 12500
}

export interface DbSchema {
  users: User[];
  leaderboard: LeaderboardEntry[];
  promotions: Promotion[];
  raffles: Raffle[];
  payouts: Payout[];
  auditLogs: AuditLog[];
  config: SystemConfig;
}

export const MILESTONE_REWARDS = [
  { threshold: 50000, prize: 10, cumulative: 10 },
  { threshold: 125000, prize: 25, cumulative: 35 },
  { threshold: 250000, prize: 50, cumulative: 85 },
  { threshold: 500000, prize: 125, cumulative: 210 },
  { threshold: 1250000, prize: 250, cumulative: 460 },
  { threshold: 2500000, prize: 500, cumulative: 960 },
  { threshold: 5000000, prize: 1000, cumulative: 1960 },
];

export const COMMISSION_TIERS = [
  { threshold: 25000, rate: 30 },
  { threshold: 50000, rate: 40 },
  { threshold: 100000, rate: 50 },
  { threshold: 200000, rate: 60 },
  { threshold: 500000, rate: 70 },
  { threshold: 1000000, rate: 75 },
];

export const DEFAULT_LEADERBOARD_PRIZES = [
  { rank: 1, prize: 3000 },
  { rank: 2, prize: 2000 },
  { rank: 3, prize: 1400 },
  { rank: 4, prize: 1000 },
  { rank: 5, prize: 800 },
  { rank: 6, prize: 650 },
  { rank: 7, prize: 550 },
  { rank: 8, prize: 450 },
  { rank: 9, prize: 400 },
  { rank: 10, prize: 350 },
  { rank: 11, prize: 300 },
  { rank: 12, prize: 250 },
  { rank: 13, prize: 225 },
  { rank: 14, prize: 200 },
  { rank: 15, prize: 175 },
  { rank: 16, prize: 150 },
  { rank: 17, prize: 125 },
  { rank: 18, prize: 100 },
  { rank: 19, prize: 100 },
  { rank: 20, prize: 75 },
  { rank: 21, prize: 50 },
  { rank: 22, prize: 50 },
  { rank: 23, prize: 50 },
  { rank: 24, prize: 50 },
];
