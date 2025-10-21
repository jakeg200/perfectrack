"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { storage } from "@/lib/storage";
import { initializeMockData } from "@/lib/mock-data";
import { User, Achievement, KPIType } from "@/types";
import { NavBar } from "@/components/nav-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { calculateLevel, getNewlyEarnedBadges } from "@/lib/points-engine";
import { DEFAULT_POINTS_CONFIG, BADGES } from "@/lib/constants";
import { Plus, Zap, Trophy, Award, RotateCcw, Database } from "lucide-react";

export default function TestDemoPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
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

    setUsers(loadedUsers);
    setAchievements(loadedAchievements);

    const user = loadedUsers.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const handleLogout = () => {
    storage.clearCurrentUser();
    router.push("/");
  };

  const handleAddPoints = (points: number) => {
    if (!currentUser) return;

    const oldLevel = currentUser.level;

    // Create mock achievement
    const newAchievement: Achievement = {
      id: `test-achievement-${Date.now()}`,
      userId: currentUser.id,
      type: "task_completed",
      description: `Test achievement (+${points} points)`,
      points,
      timestamp: new Date(),
      approved: true,
    };

    const updatedAchievements = [newAchievement, ...achievements];
    storage.saveAchievements(updatedAchievements);

    // Update user
    const newPoints = currentUser.points + points;
    const newLevel = calculateLevel(newPoints);

    const userAchievements = updatedAchievements.filter(
      (a) => a.userId === currentUser.id && a.approved
    );
    const newBadges = getNewlyEarnedBadges(
      currentUser.badgesEarned,
      userAchievements,
      currentUser
    );

    const updatedUser: User = {
      ...currentUser,
      points: newPoints,
      level: newLevel,
      badgesEarned: [...currentUser.badgesEarned, ...newBadges],
    };

    const updatedUsers = users.map((u) => (u.id === currentUser.id ? updatedUser : u));
    storage.saveUsers(updatedUsers);

    loadData(currentUser.id);

    if (oldLevel !== newLevel) {
      alert(`🎉 Level Up! You reached ${newLevel}!`);
    }

    if (newBadges.length > 0) {
      alert(`🏆 New Badge(s) Earned: ${newBadges.join(", ")}`);
    }
  };

  const handleSimulateActivity = () => {
    if (!currentUser) return;

    // Add 5 random achievements
    const kpiTypes: KPIType[] = [
      "task_completed",
      "sales_win",
      "attendance",
      "peer_kudos",
      "innovation",
      "customer_satisfaction",
    ];

    const newAchievements: Achievement[] = [];
    for (let i = 0; i < 5; i++) {
      const type = kpiTypes[Math.floor(Math.random() * kpiTypes.length)];
      newAchievements.push({
        id: `test-${Date.now()}-${i}`,
        userId: currentUser.id,
        type,
        description: `Simulated ${type} achievement`,
        points: DEFAULT_POINTS_CONFIG[type],
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 7), // Random within last week
        approved: true,
      });
    }

    const updatedAchievements = [...newAchievements, ...achievements];
    storage.saveAchievements(updatedAchievements);

    // Recalculate user stats
    const userAchievements = updatedAchievements.filter(
      (a) => a.userId === currentUser.id && a.approved
    );
    const newPoints = userAchievements.reduce((sum, a) => sum + a.points, 0);
    const newLevel = calculateLevel(newPoints);
    const newBadges = getNewlyEarnedBadges([], userAchievements, currentUser);

    const updatedUser: User = {
      ...currentUser,
      points: newPoints,
      level: newLevel,
      badgesEarned: newBadges,
    };

    const updatedUsers = users.map((u) => (u.id === currentUser.id ? updatedUser : u));
    storage.saveUsers(updatedUsers);

    loadData(currentUser.id);
    alert("Added 5 random achievements!");
  };

  const handleResetData = () => {
    if (confirm("Reset all data to initial state?")) {
      storage.clearAll();
      const mockData = initializeMockData();
      storage.saveUsers(mockData.users);
      storage.saveAchievements(mockData.achievements);
      storage.saveActivityFeed(mockData.activityFeed);
      storage.saveRedemptions(mockData.redemptions);
      storage.setInitialized();

      if (currentUser) {
        loadData(currentUser.id);
      }

      alert("Data reset complete!");
    }
  };

  const handleClearLocalStorage = () => {
    if (confirm("This will clear ALL data and log you out. Continue?")) {
      storage.clearAll();
      router.push("/");
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

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar currentUser={currentUser} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test & Demo Page</h1>
          <p className="text-gray-600">
            Experiment with features and simulate user interactions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current State */}
          <Card>
            <CardHeader>
              <CardTitle>Current User State</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4 pb-4 border-b">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="h-16 w-16 rounded-full"
                />
                <div>
                  <div className="text-xl font-bold text-gray-900">
                    {currentUser.name}
                  </div>
                  <div className="text-sm text-gray-600 capitalize">
                    {currentUser.role} - {currentUser.department}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-700">
                    {currentUser.points}
                  </div>
                  <div className="text-sm text-gray-600">Points</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-700">
                    {currentUser.level}
                  </div>
                  <div className="text-sm text-gray-600">Level</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-700">
                    {currentUser.badgesEarned.length}
                  </div>
                  <div className="text-sm text-gray-600">Badges</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-3xl font-bold text-orange-700">
                    {userAchievements.length}
                  </div>
                  <div className="text-sm text-gray-600">Achievements</div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Earned Badges:
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentUser.badgesEarned.length === 0 ? (
                    <span className="text-sm text-gray-500">No badges yet</span>
                  ) : (
                    currentUser.badgesEarned.map((badgeId) => {
                      const badge = BADGES.find((b) => b.id === badgeId);
                      return (
                        <Badge key={badgeId} variant="secondary">
                          {badge?.icon} {badge?.name}
                        </Badge>
                      );
                    })
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Simulation Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Simulation Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Add Points:</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={() => handleAddPoints(10)} variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    +10 pts
                  </Button>
                  <Button onClick={() => handleAddPoints(50)} variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    +50 pts
                  </Button>
                  <Button onClick={() => handleAddPoints(100)} variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    +100 pts
                  </Button>
                  <Button onClick={() => handleAddPoints(500)} variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    +500 pts
                  </Button>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Quick Actions:
                </h3>
                <div className="space-y-2">
                  <Button
                    onClick={handleSimulateActivity}
                    className="w-full"
                    variant="default"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Add 5 Random Achievements
                  </Button>
                  <Button
                    onClick={() => router.push("/dashboard")}
                    className="w-full"
                    variant="outline"
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    Go to Dashboard
                  </Button>
                  <Button
                    onClick={() => router.push("/leaderboard")}
                    className="w-full"
                    variant="outline"
                  >
                    <Award className="h-4 w-4 mr-2" />
                    Go to Leaderboard
                  </Button>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3 text-red-600">
                  Danger Zone:
                </h3>
                <div className="space-y-2">
                  <Button
                    onClick={handleResetData}
                    className="w-full"
                    variant="destructive"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset to Initial Data
                  </Button>
                  <Button
                    onClick={handleClearLocalStorage}
                    className="w-full"
                    variant="destructive"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Clear All & Logout
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Storage</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>• All data stored in localStorage</p>
                  <p>• Persists between sessions</p>
                  <p>• Can be cleared via browser or controls above</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Features</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>• Real-time points & level calculation</p>
                  <p>• Badge eligibility checking</p>
                  <p>• Leaderboard ranking</p>
                  <p>• Rewards redemption</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Data Stats</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>• Total Users: {users.length}</p>
                  <p>• Total Achievements: {achievements.length}</p>
                  <p>• Your Achievements: {userAchievements.length}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

