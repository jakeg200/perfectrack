import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Reward } from "@/types";
import { cn } from "@/lib/utils";

interface RewardCardProps {
  reward: Reward;
  userPoints: number;
  onRedeem: (reward: Reward) => void;
}

export function RewardCard({ reward, userPoints, onRedeem }: RewardCardProps) {
  const canAfford = userPoints >= reward.pointCost;
  const isAvailable = reward.available;

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all hover:shadow-lg",
        !canAfford && "opacity-60"
      )}
    >
      <CardContent className="p-6">
        <div className="text-center">
          <div className="text-5xl mb-3">{reward.icon}</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {reward.name}
          </h3>
          <p className="text-sm text-gray-600 mb-4 min-h-[40px]">
            {reward.description}
          </p>
          
          <div className="mb-4">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10">
              <span className="text-2xl font-bold text-primary">
                {reward.pointCost}
              </span>
              <span className="text-sm text-gray-600 ml-1">points</span>
            </div>
          </div>

          <Button
            onClick={() => onRedeem(reward)}
            disabled={!canAfford || !isAvailable}
            className="w-full"
            variant={canAfford ? "default" : "outline"}
          >
            {!isAvailable
              ? "Unavailable"
              : !canAfford
              ? `Need ${reward.pointCost - userPoints} more pts`
              : "Redeem"}
          </Button>

          {!canAfford && isAvailable && (
            <p className="text-xs text-gray-500 mt-2">
              You have {userPoints} points
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

