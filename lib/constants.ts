import { Badge, LevelThreshold, PointsConfig, Reward } from "@/types";

// Points awarded for each KPI type
export const DEFAULT_POINTS_CONFIG: PointsConfig = {
  task_completed: 10,
  sales_win: 50,
  attendance: 5,
  peer_kudos: 15,
  innovation: 30,
  customer_satisfaction: 20,
};

// Level thresholds and colors
export const LEVEL_THRESHOLDS: LevelThreshold[] = [
  { level: "Bronze", minPoints: 0, maxPoints: 99, color: "#CD7F32" },
  { level: "Silver", minPoints: 100, maxPoints: 249, color: "#C0C0C0" },
  { level: "Gold", minPoints: 250, maxPoints: 499, color: "#FFD700" },
  { level: "Platinum", minPoints: 500, maxPoints: 999, color: "#E5E4E2" },
  { level: "Diamond", minPoints: 1000, maxPoints: Infinity, color: "#B9F2FF" },
];

// Badge definitions with unlock criteria
export const BADGES: Badge[] = [
  {
    id: "first_week_hero",
    name: "First Week Hero",
    description: "Completed 5 tasks in your first week",
    icon: "🌟",
    criteria: "Complete 5 tasks within 7 days of joining",
    rarity: "common",
  },
  {
    id: "team_player",
    name: "Team Player",
    description: "Received 10 peer kudos",
    icon: "🤝",
    criteria: "Receive 10 peer kudos from colleagues",
    rarity: "common",
  },
  {
    id: "sales_champion",
    name: "Sales Champion",
    description: "Closed 20 sales deals",
    icon: "🏆",
    criteria: "Successfully close 20 sales deals",
    rarity: "rare",
  },
  {
    id: "perfect_attendance",
    name: "Perfect Attendance",
    description: "30 consecutive days of perfect attendance",
    icon: "📅",
    criteria: "Maintain perfect attendance for 30 days",
    rarity: "rare",
  },
  {
    id: "innovation_award",
    name: "Innovation Award",
    description: "Submitted 5 innovative ideas",
    icon: "💡",
    criteria: "Submit 5 innovative ideas that get approved",
    rarity: "epic",
  },
  {
    id: "customer_star",
    name: "Customer Star",
    description: "15 exceptional customer satisfaction ratings",
    icon: "⭐",
    criteria: "Receive 15 exceptional customer satisfaction ratings",
    rarity: "epic",
  },
  {
    id: "speedster",
    name: "Speedster",
    description: "Completed 50 tasks",
    icon: "⚡",
    criteria: "Complete a total of 50 tasks",
    rarity: "legendary",
  },
  {
    id: "mentor",
    name: "Mentor",
    description: "Helped onboard 5 new team members",
    icon: "🎓",
    criteria: "Successfully mentor and onboard 5 new employees",
    rarity: "legendary",
  },
];

// Rewards catalog
export const REWARDS: Reward[] = [
  {
    id: "pto_day",
    name: "Extra PTO Day",
    description: "Enjoy an additional day off",
    category: "time_off",
    pointCost: 500,
    icon: "🏖️",
    available: true,
  },
  {
    id: "gift_card_50",
    name: "$50 Gift Card",
    description: "Choose from Amazon, Target, or Starbucks",
    category: "perks",
    pointCost: 300,
    icon: "🎁",
    available: true,
  },
  {
    id: "premium_parking",
    name: "Premium Parking Spot",
    description: "Reserved parking for 1 month",
    category: "perks",
    pointCost: 200,
    icon: "🅿️",
    available: true,
  },
  {
    id: "ceo_coffee",
    name: "Coffee with CEO",
    description: "30-minute 1-on-1 coffee chat",
    category: "experiences",
    pointCost: 400,
    icon: "☕",
    available: true,
  },
  {
    id: "company_swag",
    name: "Premium Swag Bundle",
    description: "Hoodie, water bottle, and laptop stickers",
    category: "swag",
    pointCost: 150,
    icon: "👕",
    available: true,
  },
  {
    id: "wfh_day",
    name: "Work From Home Day",
    description: "One flexible WFH day (non-remote roles)",
    category: "time_off",
    pointCost: 100,
    icon: "🏡",
    available: true,
  },
  {
    id: "lunch_voucher",
    name: "Team Lunch Voucher",
    description: "$100 for team lunch of your choice",
    category: "perks",
    pointCost: 250,
    icon: "🍽️",
    available: true,
  },
  {
    id: "learning_budget",
    name: "Learning Budget",
    description: "$200 for courses or books",
    category: "perks",
    pointCost: 600,
    icon: "📚",
    available: true,
  },
  {
    id: "massage_session",
    name: "Massage Session",
    description: "1-hour professional massage",
    category: "experiences",
    pointCost: 350,
    icon: "💆",
    available: true,
  },
  {
    id: "charity_donation",
    name: "Charity Donation",
    description: "$100 donation to charity of your choice",
    category: "experiences",
    pointCost: 300,
    icon: "❤️",
    available: true,
  },
  {
    id: "early_leave",
    name: "Early Leave Pass",
    description: "Leave 2 hours early on any day",
    category: "time_off",
    pointCost: 80,
    icon: "🚀",
    available: true,
  },
  {
    id: "tech_gadget",
    name: "Tech Gadget",
    description: "Wireless earbuds or similar gadget",
    category: "swag",
    pointCost: 450,
    icon: "🎧",
    available: true,
  },
];

// KPI type labels for UI
export const KPI_LABELS: Record<string, string> = {
  task_completed: "Task Completed",
  sales_win: "Sales Win",
  attendance: "Perfect Attendance",
  peer_kudos: "Peer Kudos",
  innovation: "Innovation Submitted",
  customer_satisfaction: "Customer Satisfaction",
};

