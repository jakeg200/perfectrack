"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { storage } from "@/lib/storage";
import { User, Achievement, ActivityFeedItem } from "@/types";
import { NavBar } from "@/components/nav-bar";
import { StatsCard } from "@/components/dashboard/stats-card";
import { LevelProgress } from "@/components/dashboard/level-progress";
import { AchievementTimeline } from "@/components/dashboard/achievement-timeline";
import { BadgeGrid } from "@/components/gamification/badge-grid";
import { ActivityFeed } from "@/components/activity-feed";
import { LogAchievementModal } from "@/components/performance/log-achievement-modal";
import { LevelUpAnimation } from "@/components/gamification/level-up-animation";
import { Button } from "@/components/ui/button";
import { Trophy, Award, TrendingUp, Target, Plus } from "lucide-react";
import { calculateLevel, getNewlyEarnedBadges, getUserRank } from "@/lib/points-engine";

export default function DashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityFeedItem[]>([]);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUserId = storage.getCurrentUser();
    if (!currentUserId) {
      router.push("/");
      return;
    }

    loadData(currentUserId);
    setIsLoading(false);
  }, [router]);

  const loadData = (userId: string) => {
    const loadedUsers = storage.getUsers();
    const loadedAchievements = storage.getAchievements();
    const loadedActivityFeed = storage.getActivityFeed();

    setUsers(loadedUsers);
    setAchievements(loadedAchievements);
    setActivityFeed(loadedActivityFeed);

    const user = loadedUsers.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const handleLogout = () => {
    storage.clearCurrentUser();
    router.push("/");
  };

  const handleLogAchievement = (achievement: Omit<Achievement, "id" | "timestamp" | "approved">) => {
    if (!currentUser) return;

    const oldLevel = currentUser.level;

    // Create new achievement
    const newAchievement: Achievement = {
      ...achievement,
      id: `achievement-${Date.now()}`,
      timestamp: new Date(),
      approved: true,
    };

    // Update achievements
    const updatedAchievements = [newAchievement, ...achievements];
    storage.saveAchievements(updatedAchievements);

    // Calculate new points and level
    const userAchievements = updatedAchievements.filter(
      (a) => a.userId === currentUser.id && a.approved
    );
    const newPoints = userAchievements.reduce((sum, a) => sum + a.points, 0);
    const calculatedLevel = calculateLevel(newPoints);

    // Check for newly earned badges
    const newBadges = getNewlyEarnedBadges(
      currentUser.badgesEarned,
      userAchievements,
      currentUser
    );

    // Update user
    const updatedUser: User = {
      ...currentUser,
      points: newPoints,
      level: calculatedLevel,
      badgesEarned: [...currentUser.badgesEarned, ...newBadges],
    };

    const updatedUsers = users.map((u) => (u.id === currentUser.id ? updatedUser : u));
    storage.saveUsers(updatedUsers);

    // Add to activity feed
    const newActivity: ActivityFeedItem = {
      id: `activity-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      type: "achievement",
      description: `${achievement.description} (+${achievement.points}pts)`,
      timestamp: new Date(),
    };

    const updatedActivityFeed = [newActivity, ...activityFeed];
    storage.saveActivityFeed(updatedActivityFeed);

    // Reload data
    loadData(currentUser.id);

    // Show level-up animation if level changed
    if (oldLevel !== calculatedLevel) {
      setNewLevel(calculatedLevel);
      setShowLevelUp(true);
    }
  };

  if (isLoading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const userAchievements = achievements.filter((a) => a.userId === currentUser.id);
  const userRank = getUserRank(currentUser.id, users);
  const totalUsers = users.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar currentUser={currentUser} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {currentUser.name.split(" ")[0]}! 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Here's your performance overview
            </p>
          </div>
          <Button onClick={() => setShowLogModal(true)} size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Log Achievement
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Points"
            value={currentUser.points.toLocaleString()}
            icon={Trophy}
            description={`${currentUser.level} level`}
            gradient="bg-gradient-primary"
          />
          <StatsCard
            title="Leaderboard Rank"
            value={`#${userRank}`}
            icon={TrendingUp}
            description={`Out of ${totalUsers} employees`}
            gradient="bg-gradient-success"
          />
          <StatsCard
            title="Badges Earned"
            value={currentUser.badgesEarned.length}
            icon={Award}
            description="Achievement badges"
            gradient="bg-gradient-warning"
          />
          <StatsCard
            title="Achievements"
            value={userAchievements.length}
            icon={Target}
            description="Total completed"
            gradient="bg-gradient-danger"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-8">
            <LevelProgress points={currentUser.points} />
            <AchievementTimeline achievements={userAchievements} limit={5} />
            <BadgeGrid earnedBadges={currentUser.badgesEarned} />
          </div>

          <div className="space-y-8">
            <ActivityFeed activities={activityFeed} limit={15} />
          </div>
        </div>
      </main>

      {/* Modals */}
      <LogAchievementModal
        open={showLogModal}
        onOpenChange={setShowLogModal}
        onSubmit={handleLogAchievement}
        currentUser={currentUser}
      />

      <LevelUpAnimation
        open={showLevelUp}
        onOpenChange={setShowLevelUp}
        newLevel={newLevel}
      />
    </div>
  );
}

