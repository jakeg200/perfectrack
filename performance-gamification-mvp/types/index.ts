// Core type definitions for the Performance Gamification MVP

export type UserRole = "employee" | "manager" | "admin";

export type Department = "Engineering" | "Sales" | "Marketing" | "Support" | "HR" | "Operations";

export type KPIType = "task_completed" | "sales_win" | "attendance" | "peer_kudos" | "innovation" | "customer_satisfaction";

export type BadgeId = 
  | "first_week_hero"
  | "team_player"
  | "sales_champion"
  | "perfect_attendance"
  | "innovation_award"
  | "customer_star"
  | "speedster"
  | "mentor";

export type Level = "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond";

export type RewardCategory = "time_off" | "perks" | "swag" | "experiences";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: Department;
  avatar: string;
  title: string;
  points: number;
  level: Level;
  badgesEarned: BadgeId[];
  managerId?: string;
  joinedDate: Date;
}

export interface Achievement {
  id: string;
  userId: string;
  type: KPIType;
  description: string;
  points: number;
  timestamp: Date;
  approved: boolean;
  approvedBy?: string;
}

export interface Badge {
  id: BadgeId;
  name: string;
  description: string;
  icon: string;
  criteria: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  category: RewardCategory;
  pointCost: number;
  icon: string;
  available: boolean;
}

export interface Redemption {
  id: string;
  userId: string;
  rewardId: string;
  timestamp: Date;
  status: "pending" | "approved" | "completed";
  approvedBy?: string;
}

export interface ActivityFeedItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  type: "achievement" | "badge" | "level_up" | "redemption";
  description: string;
  timestamp: Date;
}

export interface PointsConfig {
  task_completed: number;
  sales_win: number;
  attendance: number;
  peer_kudos: number;
  innovation: number;
  customer_satisfaction: number;
}

export interface LevelThreshold {
  level: Level;
  minPoints: number;
  maxPoints: number;
  color: string;
}

