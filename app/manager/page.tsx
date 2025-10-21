"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { storage } from "@/lib/storage";
import { User, Achievement } from "@/types";
import { NavBar } from "@/components/nav-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Users, TrendingUp, Award, Target } from "lucide-react";

export default function ManagerPage() {
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

    const loadedUsers = storage.getUsers();
    const loadedAchievements = storage.getAchievements();

    setUsers(loadedUsers);
    setAchievements(loadedAchievements);

    const user = loadedUsers.find((u) => u.id === currentUserId);
    if (user) {
      if (user.role !== "manager" && user.role !== "admin") {
        router.push("/dashboard");
        return;
      }
      setCurrentUser(user);
    }

    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    storage.clearCurrentUser();
    router.push("/");
  };

  if (isLoading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Get team members (for simplicity, same department)
  const teamMembers = users.filter(
    (u) => u.department === currentUser.department && u.id !== currentUser.id
  );

  const teamAchievements = achievements.filter((a) =>
    teamMembers.some((tm) => tm.id === a.userId)
  );

  const avgPoints =
    teamMembers.length > 0
      ? Math.round(teamMembers.reduce((sum, u) => sum + u.points, 0) / teamMembers.length)
      : 0;

  const totalBadges = teamMembers.reduce((sum, u) => sum + u.badgesEarned.length, 0);

  const topPerformer = [...teamMembers].sort((a, b) => b.points - a.points)[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar currentUser={currentUser} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Team Dashboard</h1>
          <p className="text-gray-600 mt-1">
            {currentUser.department} Department Overview
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Team Members"
            value={teamMembers.length}
            icon={Users}
            description={`${currentUser.department} team`}
            gradient="bg-gradient-primary"
          />
          <StatsCard
            title="Avg Points"
            value={avgPoints.toLocaleString()}
            icon={TrendingUp}
            description="Per team member"
            gradient="bg-gradient-success"
          />
          <StatsCard
            title="Total Badges"
            value={totalBadges}
            icon={Award}
            description="Earned by team"
            gradient="bg-gradient-warning"
          />
          <StatsCard
            title="Achievements"
            value={teamAchievements.length}
            icon={Target}
            description="Team total"
            gradient="bg-gradient-danger"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Team Performers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...teamMembers]
                  .sort((a, b) => b.points - a.points)
                  .slice(0, 5)
                  .map((member, index) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-lg font-bold text-gray-400 w-6">
                          {index + 1}
                        </div>
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="h-10 w-10 rounded-full"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {member.name}
                          </div>
                          <div className="text-xs text-gray-500">{member.title}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-gray-900">
                          {member.points}
                        </div>
                        <div className="text-xs text-gray-500">{member.level}</div>
                      </div>
                    </div>
                  ))}
                {teamMembers.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No team members found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Team Achievements */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Team Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {teamAchievements
                  .sort(
                    (a, b) =>
                      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                  )
                  .slice(0, 10)
                  .map((achievement) => {
                    const user = users.find((u) => u.id === achievement.userId);
                    if (!user) return null;

                    return (
                      <div
                        key={achievement.id}
                        className="flex items-start space-x-3 pb-3 border-b last:border-b-0"
                      >
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-8 w-8 rounded-full flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {achievement.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            +{achievement.points} points
                          </p>
                        </div>
                      </div>
                    );
                  })}
                {teamAchievements.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No recent activity</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Roster */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Team Roster</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Points
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Badges
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {teamMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="h-10 w-10 rounded-full"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {member.name}
                            </div>
                            <div className="text-sm text-gray-500">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{member.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {member.level}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {member.points.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {member.badgesEarned.length}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

