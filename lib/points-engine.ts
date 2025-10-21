import { Level, BadgeId, Achievement, User, KPIType } from "@/types";
import { LEVEL_THRESHOLDS, BADGES, DEFAULT_POINTS_CONFIG } from "./constants";

// Calculate level based on total points
export function calculateLevel(points: number): Level {
  for (const threshold of LEVEL_THRESHOLDS) {
    if (points >= threshold.minPoints && points <= threshold.maxPoints) {
      return threshold.level;
    }
  }
  return "Bronze";
}

// Get level color
export function getLevelColor(level: Level): string {
  const threshold = LEVEL_THRESHOLDS.find((t) => t.level === level);
  return threshold?.color || "#CD7F32";
}

// Get progress to next level
export function getLevelProgress(points: number): {
  currentLevel: Level;
  nextLevel: Level | null;
  progress: number;
  pointsToNext: number;
  currentLevelMin: number;
  currentLevelMax: number;
} {
  const currentLevel = calculateLevel(points);
  const currentThreshold = LEVEL_THRESHOLDS.find((t) => t.level === currentLevel);
  const currentIndex = LEVEL_THRESHOLDS.findIndex((t) => t.level === currentLevel);
  const nextThreshold = LEVEL_THRESHOLDS[currentIndex + 1];

  if (!currentThreshold) {
    return {
      currentLevel: "Bronze",
      nextLevel: "Silver",
      progress: 0,
      pointsToNext: 100,
      currentLevelMin: 0,
      currentLevelMax: 99,
    };
  }

  if (!nextThreshold) {
    // Max level reached
    return {
      currentLevel,
      nextLevel: null,
      progress: 100,
      pointsToNext: 0,
      currentLevelMin: currentThreshold.minPoints,
      currentLevelMax: currentThreshold.maxPoints,
    };
  }

  const pointsInCurrentLevel = points - currentThreshold.minPoints;
  const pointsNeededForLevel = nextThreshold.minPoints - currentThreshold.minPoints;
  const progress = (pointsInCurrentLevel / pointsNeededForLevel) * 100;
  const pointsToNext = nextThreshold.minPoints - points;

  return {
    currentLevel,
    nextLevel: nextThreshold.level,
    progress: Math.min(progress, 100),
    pointsToNext: Math.max(pointsToNext, 0),
    currentLevelMin: currentThreshold.minPoints,
    currentLevelMax: currentThreshold.maxPoints,
  };
}

// Check if user earned a badge based on achievements
export function checkBadgeEligibility(
  badgeId: BadgeId,
  achievements: Achievement[],
  user: User
): boolean {
  const now = new Date();
  const joinDate = new Date(user.joinedDate);
  const daysSinceJoining = Math.floor(
    (now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  switch (badgeId) {
    case "first_week_hero": {
      // Completed 5 tasks in first 7 days
      const firstWeekAchievements = achievements.filter((a) => {
        const achievementDate = new Date(a.timestamp);
        const daysAfterJoining = Math.floor(
          (achievementDate.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        return a.type === "task_completed" && daysAfterJoining <= 7;
      });
      return firstWeekAchievements.length >= 5;
    }

    case "team_player": {
      // Received 10 peer kudos
      const kudosCount = achievements.filter((a) => a.type === "peer_kudos").length;
      return kudosCount >= 10;
    }

    case "sales_champion": {
      // Closed 20 sales deals
      const salesCount = achievements.filter((a) => a.type === "sales_win").length;
      return salesCount >= 20;
    }

    case "perfect_attendance": {
      // 30 consecutive days of perfect attendance
      const attendanceCount = achievements.filter((a) => a.type === "attendance").length;
      return attendanceCount >= 30;
    }

    case "innovation_award": {
      // Submitted 5 innovative ideas
      const innovationCount = achievements.filter(
        (a) => a.type === "innovation" && a.approved
      ).length;
      return innovationCount >= 5;
    }

    case "customer_star": {
      // 15 exceptional customer satisfaction ratings
      const satisfactionCount = achievements.filter(
        (a) => a.type === "customer_satisfaction"
      ).length;
      return satisfactionCount >= 15;
    }

    case "speedster": {
      // Completed 50 tasks
      const taskCount = achievements.filter((a) => a.type === "task_completed").length;
      return taskCount >= 50;
    }

    case "mentor": {
      // This would need special tracking, for MVP we'll use a simple heuristic
      // Users with peer_kudos + tasks > 40 could be mentors
      const totalActivity = achievements.filter(
        (a) => a.type === "peer_kudos" || a.type === "task_completed"
      ).length;
      return totalActivity >= 40;
    }

    default:
      return false;
  }
}

// Get all newly earned badges
export function getNewlyEarnedBadges(
  currentBadges: BadgeId[],
  achievements: Achievement[],
  user: User
): BadgeId[] {
  const newBadges: BadgeId[] = [];

  for (const badge of BADGES) {
    if (!currentBadges.includes(badge.id) && checkBadgeEligibility(badge.id, achievements, user)) {
      newBadges.push(badge.id);
    }
  }

  return newBadges;
}

// Calculate points for a KPI type
export function getPointsForKPI(kpiType: KPIType, config = DEFAULT_POINTS_CONFIG): number {
  return config[kpiType] || 0;
}

// Get user rank in leaderboard
export function getUserRank(userId: string, users: User[]): number {
  const sortedUsers = [...users].sort((a, b) => b.points - a.points);
  return sortedUsers.findIndex((u) => u.id === userId) + 1;
}

