import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Achievement, KPIType } from "@/types";
import { formatDate } from "@/lib/utils";
import { KPI_LABELS } from "@/lib/constants";

interface AchievementHistoryProps {
  achievements: Achievement[];
}

export function AchievementHistory({ achievements }: AchievementHistoryProps) {
  const allKpiTypes: (KPIType | "all")[] = [
    "all",
    "task_completed",
    "sales_win",
    "attendance",
    "peer_kudos",
    "innovation",
    "customer_satisfaction",
  ];

  const filterAchievements = (type: KPIType | "all") => {
    if (type === "all") return achievements;
    return achievements.filter((a) => a.type === type);
  };

  const sortedAchievements = [...achievements].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievement History</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
            <TabsTrigger value="all" className="text-xs">
              All
            </TabsTrigger>
            <TabsTrigger value="task_completed" className="text-xs">
              Tasks
            </TabsTrigger>
            <TabsTrigger value="sales_win" className="text-xs">
              Sales
            </TabsTrigger>
            <TabsTrigger value="peer_kudos" className="text-xs">
              Kudos
            </TabsTrigger>
            <TabsTrigger value="attendance" className="text-xs hidden lg:block">
              Attendance
            </TabsTrigger>
            <TabsTrigger value="innovation" className="text-xs hidden lg:block">
              Innovation
            </TabsTrigger>
            <TabsTrigger value="customer_satisfaction" className="text-xs hidden lg:block">
              Customer
            </TabsTrigger>
          </TabsList>

          {allKpiTypes.map((type) => (
            <TabsContent key={type} value={type} className="mt-4">
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filterAchievements(type as any).length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No achievements in this category</p>
                  </div>
                ) : (
                  filterAchievements(type as any).map((achievement) => (
                    <div
                      key={achievement.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {achievement.description}
                        </p>
                        <div className="flex items-center mt-1 space-x-2">
                          <span className="text-xs text-gray-500">
                            {KPI_LABELS[achievement.type]}
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {formatDate(achievement.timestamp)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          +{achievement.points}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

