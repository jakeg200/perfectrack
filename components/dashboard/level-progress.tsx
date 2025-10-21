import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getLevelProgress, getLevelColor } from "@/lib/points-engine";
import { Trophy } from "lucide-react";

interface LevelProgressProps {
  points: number;
}

export function LevelProgress({ points }: LevelProgressProps) {
  const progressData = getLevelProgress(points);
  const levelColor = getLevelColor(progressData.currentLevel);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Trophy className="h-5 w-5 mr-2" style={{ color: levelColor }} />
          Level Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div
              className="text-2xl font-bold"
              style={{ color: levelColor }}
            >
              {progressData.currentLevel}
            </div>
            <div className="text-sm text-gray-500">
              {points} / {progressData.currentLevelMax === Infinity ? "∞" : progressData.currentLevelMax} points
            </div>
          </div>
          {progressData.nextLevel && (
            <div className="text-right">
              <div className="text-sm text-gray-600">Next Level</div>
              <div className="text-lg font-semibold text-gray-900">
                {progressData.nextLevel}
              </div>
              <div className="text-xs text-gray-500">
                {progressData.pointsToNext} points to go
              </div>
            </div>
          )}
        </div>

        {progressData.nextLevel && (
          <div className="space-y-2">
            <Progress value={progressData.progress} max={100} />
            <div className="text-xs text-center text-gray-500">
              {progressData.progress.toFixed(1)}% complete
            </div>
          </div>
        )}

        {!progressData.nextLevel && (
          <div className="text-center py-4 bg-yellow-50 rounded-lg">
            <p className="text-sm font-medium text-yellow-800">
              🎉 Maximum level reached!
            </p>
            <p className="text-xs text-yellow-600 mt-1">
              You're at the top tier
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

