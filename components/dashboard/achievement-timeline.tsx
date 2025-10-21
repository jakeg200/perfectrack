import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Achievement } from "@/types";
import { formatRelativeTime } from "@/lib/utils";
import { KPI_LABELS } from "@/lib/constants";
import { CheckCircle2 } from "lucide-react";

interface AchievementTimelineProps {
  achievements: Achievement[];
  limit?: number;
}

export function AchievementTimeline({ achievements, limit = 5 }: AchievementTimelineProps) {
  const recentAchievements = achievements
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        {recentAchievements.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No achievements yet</p>
            <p className="text-xs mt-1">Start completing tasks to earn points!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-start space-x-3 pb-4 border-b last:border-b-0 last:pb-0"
              >
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {achievement.description}
                  </p>
                  <div className="flex items-center mt-1 space-x-2">
                    <span className="text-xs text-gray-500">
                      {KPI_LABELS[achievement.type]}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">
                      {formatRelativeTime(achievement.timestamp)}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    +{achievement.points}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

