import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge as BadgeUI } from "@/components/ui/badge";
import { BADGES } from "@/lib/constants";
import { BadgeId } from "@/types";
import { Lock } from "lucide-react";

interface BadgeGridProps {
  earnedBadges: BadgeId[];
}

export function BadgeGrid({ earnedBadges }: BadgeGridProps) {
  const getRarityClass = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "badge-common";
      case "rare":
        return "badge-rare";
      case "epic":
        return "badge-epic";
      case "legendary":
        return "badge-legendary";
      default:
        return "badge-common";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Badge Collection</span>
          <span className="text-sm font-normal text-gray-500">
            {earnedBadges.length} / {BADGES.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {BADGES.map((badge) => {
            const isEarned = earnedBadges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`relative p-4 rounded-lg border-2 transition-all ${
                  isEarned
                    ? "bg-white border-gray-200 hover:shadow-md"
                    : "bg-gray-50 border-gray-100 opacity-60"
                }`}
              >
                {!isEarned && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/10 rounded-lg">
                    <Lock className="h-6 w-6 text-gray-400" />
                  </div>
                )}
                <div className="text-center">
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">
                    {badge.name}
                  </h4>
                  <p className="text-xs text-gray-600 mb-2 min-h-[32px]">
                    {badge.description}
                  </p>
                  <BadgeUI
                    variant="outline"
                    className={`text-xs ${getRarityClass(badge.rarity)}`}
                  >
                    {badge.rarity}
                  </BadgeUI>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

