"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { storage } from "@/lib/storage";
import { User, Department } from "@/types";
import { NavBar } from "@/components/nav-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select } from "@/components/ui/select";
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";
import { Trophy } from "lucide-react";

export default function LeaderboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | "all">("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUserId = storage.getCurrentUser();
    if (!currentUserId) {
      router.push("/");
      return;
    }

    const loadedUsers = storage.getUsers();
    setUsers(loadedUsers);

    const user = loadedUsers.find((u) => u.id === currentUserId);
    if (user) {
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

  const departments: (Department | "all")[] = [
    "all",
    "Engineering",
    "Sales",
    "Marketing",
    "Support",
    "HR",
    "Operations",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar currentUser={currentUser} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Trophy className="h-8 w-8 text-yellow-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
          </div>
          <p className="text-gray-600">
            See how you rank against your colleagues
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Rankings</CardTitle>
              <div className="w-64">
                <Select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value as Department | "all")}
                >
                  <option value="all">All Departments</option>
                  {departments.slice(1).map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all-time">
              <TabsList>
                <TabsTrigger value="all-time">All Time</TabsTrigger>
                <TabsTrigger value="this-month">This Month</TabsTrigger>
                <TabsTrigger value="this-week">This Week</TabsTrigger>
              </TabsList>

              <TabsContent value="all-time" className="mt-6">
                <LeaderboardTable
                  users={users}
                  currentUserId={currentUser.id}
                  department={selectedDepartment}
                />
              </TabsContent>

              <TabsContent value="this-month" className="mt-6">
                <div className="text-center py-12 text-gray-500">
                  <p className="text-sm">Monthly leaderboard coming soon</p>
                  <p className="text-xs mt-1">This feature requires time-based filtering</p>
                </div>
              </TabsContent>

              <TabsContent value="this-week" className="mt-6">
                <div className="text-center py-12 text-gray-500">
                  <p className="text-sm">Weekly leaderboard coming soon</p>
                  <p className="text-xs mt-1">This feature requires time-based filtering</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {users.length}
                </div>
                <p className="text-sm text-gray-600">Total Employees</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {users.reduce((sum, u) => sum + u.points, 0).toLocaleString()}
                </div>
                <p className="text-sm text-gray-600">Total Points Earned</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {users.reduce((sum, u) => sum + u.badgesEarned.length, 0)}
                </div>
                <p className="text-sm text-gray-600">Total Badges Earned</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

