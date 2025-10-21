"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "@/types";
import { cn } from "@/lib/utils";
import { Trophy, LayoutDashboard, Award, Gift, Users, Settings } from "lucide-react";

interface NavBarProps {
  currentUser: User | null;
  onLogout: () => void;
}

export function NavBar({ currentUser, onLogout }: NavBarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["employee", "manager", "admin"] },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy, roles: ["employee", "manager", "admin"] },
    { href: "/rewards", label: "Rewards", icon: Gift, roles: ["employee", "manager", "admin"] },
    { href: "/manager", label: "Team", icon: Users, roles: ["manager", "admin"] },
    { href: "/admin", label: "Admin", icon: Settings, roles: ["admin"] },
  ];

  const filteredNavItems = navItems.filter((item) =>
    currentUser ? item.roles.includes(currentUser.role) : false
  );

  if (!currentUser) return null;

  return (
    <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/dashboard" className="flex items-center mr-8">
              <Award className="h-8 w-8 text-primary mr-2" />
              <span className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">
                PerfTrack
              </span>
            </Link>
            <div className="hidden sm:flex sm:space-x-8">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors",
                      isActive
                        ? "border-primary text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    )}
                  >
                    <Icon className="h-4 w-4 mr-1.5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-8 w-8 rounded-full border-2 border-primary"
              />
              <div className="hidden md:block">
                <div className="text-sm font-medium text-gray-900">{currentUser.name}</div>
                <div className="text-xs text-gray-500 capitalize">{currentUser.role}</div>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="sm:hidden border-t">
        <div className="flex justify-around py-2">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center px-3 py-2 text-xs font-medium rounded-md transition-colors",
                  isActive ? "text-primary bg-primary/10" : "text-gray-500 hover:text-gray-700"
                )}
              >
                <Icon className="h-5 w-5 mb-1" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

