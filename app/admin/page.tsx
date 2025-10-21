"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { storage } from "@/lib/storage";
import { User, Achievement, PointsConfig } from "@/types";
import { NavBar } from "@/components/nav-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, Users, Trophy, Award, RotateCcw } from "lucide-react";
import { DEFAULT_POINTS_CONFIG, KPI_LABELS, BADGES } from "@/lib/constants";
import { initializeMockData } from "@/lib/mock-data";

export default function AdminPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [pointsConfig, setPointsConfig] = useState<PointsConfig>(DEFAULT_POINTS_CONFIG);
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
    const loadedPointsConfig = storage.getPointsConfig() || DEFAULT_POINTS_CONFIG;

    setUsers(loadedUsers);
    setAchievements(loadedAchievements);
    setPointsConfig(loadedPointsConfig);

    const user = loadedUsers.find((u) => u.id === userId);
    if (user) {
      if (user.role !== "admin") {
        router.push("/dashboard");
        return;
      }
      setCurrentUser(user);
    }
  };

  const handleLogout = () => {
    storage.clearCurrentUser();
    router.push("/");
  };

  const handleUpdatePointsConfig = (kpiType: keyof PointsConfig, value: number) => {
    const updatedConfig = {
      ...pointsConfig,
      [kpiType]: value,
    };
    setPointsConfig(updatedConfig);
    storage.savePointsConfig(updatedConfig);
  };

  const handleResetData = () => {
    if (confirm("Are you sure you want to reset all data? This cannot be undone.")) {
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
      
      alert("Data has been reset successfully!");
    }
  };

  if (isLoading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalPoints = users.reduce((sum, u) => sum + u.points, 0);
  const totalBadges = users.reduce((sum, u) => sum + u.badgesEarned.length, 0);

  // Badge distribution
  const badgeDistribution = BADGES.map((badge) => ({
    badge,
    count: users.filter((u) => u.badgesEarned.includes(badge.id)).length,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar currentUser={currentUser} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <Settings className="h-8 w-8 text-primary mr-3" />
                <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              </div>
              <p className="text-gray-600">System configuration and analytics</p>
            </div>
            <Button onClick={handleResetData} variant="destructive">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset All Data
            </Button>
          </div>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Users"
            value={users.length}
            icon={Users}
            description="Registered employees"
            gradient="bg-gradient-primary"
          />
          <StatsCard
            title="Total Points"
            value={totalPoints.toLocaleString()}
            icon={Trophy}
            description="Awarded company-wide"
            gradient="bg-gradient-success"
          />
          <StatsCard
            title="Total Badges"
            value={totalBadges}
            icon={Award}
            description="Earned by employees"
            gradient="bg-gradient-warning"
          />
          <StatsCard
            title="Achievements"
            value={achievements.length}
            icon={Trophy}
            description="Total logged"
            gradient="bg-gradient-danger"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Points Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Points Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(Object.keys(pointsConfig) as Array<keyof PointsConfig>).map((kpiType) => (
                  <div key={kpiType} className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      {KPI_LABELS[kpiType]}
                    </label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={pointsConfig[kpiType]}
                        onChange={(e) =>
                          handleUpdatePointsConfig(kpiType, parseInt(e.target.value) || 0)
                        }
                        className="w-20"
                        min="0"
                      />
                      <span className="text-sm text-gray-500">pts</span>
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    Changes are saved automatically and apply to new achievements
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Badge Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Badge Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {badgeDistribution.map(({ badge, count }) => (
                  <div
                    key={badge.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{badge.icon}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {badge.name}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                          {badge.rarity}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{count}</div>
                      <div className="text-xs text-gray-500">earned</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department Breakdown */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Department Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Employees
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Avg Points
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total Points
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Badges
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {["Engineering", "Sales", "Marketing", "Support", "HR", "Operations"].map(
                    (dept) => {
                      const deptUsers = users.filter((u) => u.department === dept);
                      const deptPoints = deptUsers.reduce((sum, u) => sum + u.points, 0);
                      const avgPoints =
                        deptUsers.length > 0 ? Math.round(deptPoints / deptUsers.length) : 0;
                      const deptBadges = deptUsers.reduce(
                        (sum, u) => sum + u.badgesEarned.length,
                        0
                      );

                      return (
                        <tr key={dept} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{dept}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{deptUsers.length}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {avgPoints.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {deptPoints.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{deptBadges}</div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

