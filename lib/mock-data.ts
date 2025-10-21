import {
  User,
  Achievement,
  KPIType,
  Department,
  UserRole,
  ActivityFeedItem,
  BadgeId,
} from "@/types";
import { calculateLevel, getNewlyEarnedBadges } from "./points-engine";
import { DEFAULT_POINTS_CONFIG } from "./constants";

// Generate realistic employee names
const FIRST_NAMES = [
  "Sarah",
  "Mike",
  "Alex",
  "Emma",
  "James",
  "Sofia",
  "Liam",
  "Olivia",
  "Noah",
  "Ava",
  "Ethan",
  "Isabella",
  "Mason",
  "Mia",
  "Lucas",
  "Charlotte",
  "Oliver",
  "Amelia",
  "Elijah",
  "Harper",
];

const LAST_NAMES = [
  "Johnson",
  "Williams",
  "Brown",
  "Davis",
  "Miller",
  "Wilson",
  "Moore",
  "Taylor",
  "Anderson",
  "Thomas",
  "Jackson",
  "White",
  "Harris",
  "Martin",
  "Garcia",
  "Martinez",
  "Robinson",
  "Clark",
  "Rodriguez",
  "Lewis",
];

const DEPARTMENTS: Department[] = ["Engineering", "Sales", "Marketing", "Support", "HR", "Operations"];

const JOB_TITLES: Record<Department, string[]> = {
  Engineering: ["Software Engineer", "Senior Developer", "DevOps Engineer", "Tech Lead"],
  Sales: ["Sales Representative", "Account Executive", "Sales Manager", "BDR"],
  Marketing: ["Marketing Manager", "Content Specialist", "SEO Analyst", "Brand Manager"],
  Support: ["Support Specialist", "Customer Success Manager", "Support Lead"],
  HR: ["HR Manager", "Recruiter", "People Operations"],
  Operations: ["Operations Manager", "Project Coordinator", "Business Analyst"],
};

const KPI_DESCRIPTIONS: Record<KPIType, string[]> = {
  task_completed: [
    "Completed user authentication feature",
    "Fixed critical bug in payment system",
    "Deployed new dashboard redesign",
    "Updated API documentation",
    "Refactored legacy codebase",
  ],
  sales_win: [
    "Closed deal with Acme Corp - $50K ARR",
    "Signed enterprise client TechStart",
    "Renewal with existing client",
    "Upsold premium features to client",
    "Won competitive bid against rival",
  ],
  attendance: [
    "Perfect attendance this week",
    "On time for all meetings",
    "Full week with no absences",
  ],
  peer_kudos: [
    "Helped debug production issue",
    "Mentored new team member",
    "Led successful sprint planning",
    "Great presentation at all-hands",
    "Supported team during crunch time",
  ],
  innovation: [
    "Proposed new automation workflow",
    "Suggested cost-saving infrastructure change",
    "Created internal tool for efficiency",
    "Designed new product feature concept",
  ],
  customer_satisfaction: [
    "Resolved customer issue in record time",
    "Received 5-star review from client",
    "Turned around unhappy customer",
    "Exceptional support ticket resolution",
  ],
};

// Generate random avatar (using initials-based placeholders)
function generateAvatar(name: string): string {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");
  const colors = ["ef4444", "3b82f6", "10b981", "f59e0b", "8b5cf6", "ec4899"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  return `https://ui-avatars.com/api/?name=${initials}&background=${color}&color=fff&size=200`;
}

// Generate random date within range
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Generate mock users
export function generateMockUsers(count: number = 18): User[] {
  const users: User[] = [];
  const usedNames = new Set<string>();

  // Create 3 specific personas first
  const personas: Partial<User>[] = [
    {
      id: "user-sarah",
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      role: "employee",
      department: "Engineering",
      title: "Senior Developer",
    },
    {
      id: "user-mike",
      name: "Mike Wilson",
      email: "mike.wilson@company.com",
      role: "manager",
      department: "Sales",
      title: "Sales Manager",
    },
    {
      id: "user-alex",
      name: "Alex Martinez",
      email: "alex.martinez@company.com",
      role: "admin",
      department: "HR",
      title: "HR Manager",
    },
  ];

  personas.forEach((persona) => {
    usedNames.add(persona.name!);
  });

  for (let i = 0; i < count; i++) {
    let name: string;
    do {
      const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
      const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
      name = `${firstName} ${lastName}`;
    } while (usedNames.has(name));

    usedNames.add(name);

    const department = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
    const titles = JOB_TITLES[department];
    const title = titles[Math.floor(Math.random() * titles.length)];

    let role: UserRole = "employee";
    if (i < 3) {
      role = personas[i]?.role as UserRole;
    } else if (i < 6) {
      role = "manager";
    }

    const joinedDate = randomDate(new Date(2023, 0, 1), new Date(2024, 8, 1));

    const user: User = {
      id: i < 3 ? personas[i].id! : `user-${i}`,
      name: i < 3 ? personas[i].name! : name,
      email: i < 3 ? personas[i].email! : name.toLowerCase().replace(" ", ".") + "@company.com",
      role,
      department: i < 3 ? personas[i].department! : department,
      avatar: generateAvatar(i < 3 ? personas[i].name! : name),
      title: i < 3 ? personas[i].title! : title,
      points: 0, // Will be calculated from achievements
      level: "Bronze", // Will be calculated
      badgesEarned: [],
      managerId: role === "employee" && i >= 3 ? users[Math.floor(Math.random() * 3) + 3]?.id : undefined,
      joinedDate,
    };

    users.push(user);
  }

  return users;
}

// Generate mock achievements for users
export function generateMockAchievements(users: User[]): Achievement[] {
  const achievements: Achievement[] = [];
  const kpiTypes: KPIType[] = [
    "task_completed",
    "sales_win",
    "attendance",
    "peer_kudos",
    "innovation",
    "customer_satisfaction",
  ];

  users.forEach((user) => {
    // Each user gets 5-30 achievements
    const achievementCount = Math.floor(Math.random() * 26) + 5;
    const joinDate = new Date(user.joinedDate);
    const now = new Date();

    for (let i = 0; i < achievementCount; i++) {
      let kpiType: KPIType;

      // Bias KPI types based on department
      if (user.department === "Sales") {
        kpiType = Math.random() > 0.4 ? "sales_win" : kpiTypes[Math.floor(Math.random() * kpiTypes.length)];
      } else if (user.department === "Engineering") {
        kpiType = Math.random() > 0.5 ? "task_completed" : kpiTypes[Math.floor(Math.random() * kpiTypes.length)];
      } else {
        kpiType = kpiTypes[Math.floor(Math.random() * kpiTypes.length)];
      }

      const descriptions = KPI_DESCRIPTIONS[kpiType];
      const description = descriptions[Math.floor(Math.random() * descriptions.length)];
      const points = DEFAULT_POINTS_CONFIG[kpiType];
      const timestamp = randomDate(joinDate, now);

      achievements.push({
        id: `achievement-${user.id}-${i}`,
        userId: user.id,
        type: kpiType,
        description,
        points,
        timestamp,
        approved: true,
      });
    }
  });

  return achievements.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// Calculate user points and badges from achievements
export function calculateUserStats(users: User[], achievements: Achievement[]): User[] {
  return users.map((user) => {
    const userAchievements = achievements.filter((a) => a.userId === user.id && a.approved);
    const points = userAchievements.reduce((sum, a) => sum + a.points, 0);
    const level = calculateLevel(points);
    const badgesEarned = getNewlyEarnedBadges([], userAchievements, user);

    return {
      ...user,
      points,
      level,
      badgesEarned,
    };
  });
}

// Generate activity feed from achievements
export function generateActivityFeed(
  users: User[],
  achievements: Achievement[],
  limit: number = 50
): ActivityFeedItem[] {
  const activities: ActivityFeedItem[] = [];

  // Recent achievements
  const recentAchievements = achievements.slice(0, limit);

  recentAchievements.forEach((achievement, index) => {
    const user = users.find((u) => u.id === achievement.userId);
    if (!user) return;

    activities.push({
      id: `activity-${achievement.id}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      type: "achievement",
      description: `${achievement.description} (+${achievement.points}pts)`,
      timestamp: achievement.timestamp,
    });
  });

  // Add some badge unlock activities
  users.forEach((user) => {
    if (user.badgesEarned.length > 0) {
      const randomBadge = user.badgesEarned[Math.floor(Math.random() * user.badgesEarned.length)];
      activities.push({
        id: `activity-badge-${user.id}-${randomBadge}`,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        type: "badge",
        description: `Unlocked ${randomBadge.replace(/_/g, " ")} badge!`,
        timestamp: randomDate(new Date(user.joinedDate), new Date()),
      });
    }
  });

  // Sort by timestamp
  return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, limit);
}

// Initialize all mock data
export function initializeMockData() {
  const users = generateMockUsers(18);
  const achievements = generateMockAchievements(users);
  const usersWithStats = calculateUserStats(users, achievements);
  const activityFeed = generateActivityFeed(usersWithStats, achievements);

  return {
    users: usersWithStats,
    achievements,
    activityFeed,
    redemptions: [], // Start with no redemptions
  };
}

