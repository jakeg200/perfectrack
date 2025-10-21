"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { storage } from "@/lib/storage";
import { User, Redemption, Reward as RewardType } from "@/types";
import { NavBar } from "@/components/nav-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RewardCard } from "@/components/rewards/reward-card";
import { RedemptionModal } from "@/components/rewards/redemption-modal";
import { REWARDS } from "@/lib/constants";
import { Gift, CheckCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function RewardsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [selectedReward, setSelectedReward] = useState<RewardType | null>(null);
  const [showRedemptionModal, setShowRedemptionModal] = useState(false);
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
    const loadedRedemptions = storage.getRedemptions();

    setUsers(loadedUsers);
    setRedemptions(loadedRedemptions);

    const user = loadedUsers.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const handleLogout = () => {
    storage.clearCurrentUser();
    router.push("/");
  };

  const handleRedeemClick = (reward: RewardType) => {
    setSelectedReward(reward);
    setShowRedemptionModal(true);
  };

  const handleConfirmRedemption = () => {
    if (!currentUser || !selectedReward) return;

    // Create redemption
    const newRedemption: Redemption = {
      id: `redemption-${Date.now()}`,
      userId: currentUser.id,
      rewardId: selectedReward.id,
      timestamp: new Date(),
      status: "approved",
    };

    const updatedRedemptions = [newRedemption, ...redemptions];
    storage.saveRedemptions(updatedRedemptions);

    // Deduct points from user
    const updatedUser: User = {
      ...currentUser,
      points: currentUser.points - selectedReward.pointCost,
    };

    const updatedUsers = users.map((u) => (u.id === currentUser.id ? updatedUser : u));
    storage.saveUsers(updatedUsers);

    // Reload data
    loadData(currentUser.id);
    setSelectedReward(null);
  };

  if (isLoading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const userRedemptions = redemptions.filter((r) => r.userId === currentUser.id);

  const rewardCategories = [
    { id: "all", name: "All Rewards" },
    { id: "time_off", name: "Time Off" },
    { id: "perks", name: "Perks" },
    { id: "swag", name: "Swag" },
    { id: "experiences", name: "Experiences" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar currentUser={currentUser} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Gift className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Rewards</h1>
          </div>
          <p className="text-gray-600">
            Redeem your points for amazing rewards
          </p>
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-primary/10 rounded-lg">
            <span className="text-sm text-gray-700 mr-2">Your balance:</span>
            <span className="text-2xl font-bold text-primary">
              {currentUser.points}
            </span>
            <span className="text-sm text-gray-700 ml-1">points</span>
          </div>
        </div>

        <Tabs defaultValue="catalog">
          <TabsList>
            <TabsTrigger value="catalog">Rewards Catalog</TabsTrigger>
            <TabsTrigger value="my-redemptions">
              My Redemptions ({userRedemptions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="catalog" className="mt-6">
            <Tabs defaultValue="all">
              <TabsList>
                {rewardCategories.map((cat) => (
                  <TabsTrigger key={cat.id} value={cat.id}>
                    {cat.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {rewardCategories.map((category) => (
                <TabsContent key={category.id} value={category.id} className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {REWARDS.filter(
                      (r) => category.id === "all" || r.category === category.id
                    ).map((reward) => (
                      <RewardCard
                        key={reward.id}
                        reward={reward}
                        userPoints={currentUser.points}
                        onRedeem={handleRedeemClick}
                      />
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>

          <TabsContent value="my-redemptions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Redemption History</CardTitle>
              </CardHeader>
              <CardContent>
                {userRedemptions.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Gift className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm">No redemptions yet</p>
                    <p className="text-xs mt-1">Start redeeming rewards with your points!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userRedemptions.map((redemption) => {
                      const reward = REWARDS.find((r) => r.id === redemption.rewardId);
                      if (!reward) return null;

                      return (
                        <div
                          key={redemption.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="text-3xl">{reward.icon}</div>
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900">
                                {reward.name}
                              </h4>
                              <p className="text-xs text-gray-600">{reward.description}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatDate(redemption.timestamp)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center text-green-600 mb-1">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              <span className="text-xs font-medium capitalize">
                                {redemption.status}
                              </span>
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {reward.pointCost} pts
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <RedemptionModal
        open={showRedemptionModal}
        onOpenChange={setShowRedemptionModal}
        reward={selectedReward}
        userPoints={currentUser.points}
        onConfirm={handleConfirmRedemption}
      />
    </div>
  );
}

