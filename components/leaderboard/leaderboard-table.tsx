import { User, Department } from "@/types";
import { getLevelColor } from "@/lib/points-engine";
import { Trophy, Medal, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderboardTableProps {
  users: User[];
  currentUserId: string;
  department?: Department | "all";
}

export function LeaderboardTable({ users, currentUserId, department }: LeaderboardTableProps) {
  // Filter by department if specified
  let filteredUsers = department && department !== "all"
    ? users.filter((u) => u.department === department)
    : users;

  // Sort by points
  const sortedUsers = [...filteredUsers].sort((a, b) => b.points - a.points);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
    return null;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rank
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Employee
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Department
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Level
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Points
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Badges
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedUsers.map((user, index) => {
            const rank = index + 1;
            const isCurrentUser = user.id === currentUserId;
            const levelColor = getLevelColor(user.level);

            return (
              <tr
                key={user.id}
                className={cn(
                  "transition-colors",
                  isCurrentUser ? "bg-primary/5 border-l-4 border-primary" : "hover:bg-gray-50"
                )}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getRankIcon(rank) || (
                      <span className="text-sm font-medium text-gray-900">
                        {rank}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-10 w-10 rounded-full border-2"
                      style={{ borderColor: isCurrentUser ? "hsl(var(--primary))" : "#e5e7eb" }}
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                        {user.name}
                        {isCurrentUser && (
                          <span className="ml-2 text-xs bg-primary text-white px-2 py-0.5 rounded">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{user.title}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{user.department}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className="text-sm font-semibold"
                    style={{ color: levelColor }}
                  >
                    {user.level}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">
                    {user.points.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {user.badgesEarned.length}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {sortedUsers.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No employees found</p>
        </div>
      )}
    </div>
  );
}

