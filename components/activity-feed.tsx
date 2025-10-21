import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityFeedItem } from "@/types";
import { formatRelativeTime } from "@/lib/utils";
import { Trophy, Award, TrendingUp, Gift } from "lucide-react";

interface ActivityFeedProps {
  activities: ActivityFeedItem[];
  limit?: number;
}

export function ActivityFeed({ activities, limit = 10 }: ActivityFeedProps) {
  const recentActivities = activities.slice(0, limit);

  const getActivityIcon = (type: ActivityFeedItem["type"]) => {
    switch (type) {
      case "achievement":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "badge":
        return <Award className="h-4 w-4 text-purple-600" />;
      case "level_up":
        return <Trophy className="h-4 w-4 text-yellow-600" />;
      case "redemption":
        return <Gift className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Activity Feed</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {recentActivities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No recent activity</p>
            </div>
          ) : (
            recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 pb-4 border-b last:border-b-0 last:pb-0"
              >
                <img
                  src={activity.userAvatar}
                  alt={activity.userName}
                  className="h-10 w-10 rounded-full flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      {activity.userName}
                    </span>
                    <span className="flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatRelativeTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

