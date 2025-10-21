"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { storage } from "@/lib/storage";
import { initializeMockData } from "@/lib/mock-data";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Award, TrendingUp, Users, Zap } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Initialize mock data if not already done
    if (!storage.isInitialized()) {
      const mockData = initializeMockData();
      storage.saveUsers(mockData.users);
      storage.saveAchievements(mockData.achievements);
      storage.saveActivityFeed(mockData.activityFeed);
      storage.saveRedemptions(mockData.redemptions);
      storage.setInitialized();
    }

    // Load users
    const loadedUsers = storage.getUsers();
    setUsers(loadedUsers);
    setIsInitializing(false);

    // Check if already logged in
    const currentUserId = storage.getCurrentUser();
    if (currentUserId) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleLogin = () => {
    if (selectedUserId) {
      storage.saveCurrentUser(selectedUserId);
      router.push("/dashboard");
    }
  };

  // Highlight the 3 main personas
  const mainPersonas = users.filter((u) =>
    ["user-sarah", "user-mike", "user-alex"].includes(u.id)
  );

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing PerfTrack...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <div className="container mx-auto px-4 pt-16 pb-8 text-center">
        <div className="flex items-center justify-center mb-6">
          <Award className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          PerfTrack
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          Employee Performance Gamification Platform
        </p>
        <p className="text-sm text-gray-500">
          Measure, reward, and gamify employee performance
        </p>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 shadow-md">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Track Performance</h3>
            <p className="text-sm text-gray-600">Real-time KPI tracking</p>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 shadow-md">
              <Zap className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Earn Points</h3>
            <p className="text-sm text-gray-600">Gamified achievements</p>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 shadow-md">
              <Award className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Unlock Badges</h3>
            <p className="text-sm text-gray-600">Achievement recognition</p>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 shadow-md">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Compete & Win</h3>
            <p className="text-sm text-gray-600">Leaderboard rankings</p>
          </div>
        </div>
      </div>

      {/* Login Card */}
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-center">Demo Login</CardTitle>
            <CardDescription className="text-center">
              Select a user to explore the platform (no password required)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quick personas */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Select:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {mainPersonas.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => setSelectedUserId(user.id)}
                    className={`p-4 border-2 rounded-lg text-left transition-all hover:shadow-md ${
                      selectedUserId === user.id
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-12 w-12 rounded-full"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                        <div className="text-xs text-gray-400">{user.department}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* All users dropdown */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Or select any user:
              </label>
              <Select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
              >
                <option value="">Choose a user...</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} - {user.role} ({user.department})
                  </option>
                ))}
              </Select>
            </div>

            <Button
              onClick={handleLogin}
              disabled={!selectedUserId}
              className="w-full"
              size="lg"
            >
              Login & Explore
            </Button>

            <div className="text-center text-xs text-gray-500 pt-4 border-t">
              <p>This is a demo MVP with mock data stored in localStorage</p>
              <p className="mt-1">All data will persist between sessions</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="container mx-auto px-4 py-8 text-center text-sm text-gray-500">
        <p>PerfTrack MVP - Built with Next.js, TypeScript, and Tailwind CSS</p>
      </div>
    </div>
  );
}

