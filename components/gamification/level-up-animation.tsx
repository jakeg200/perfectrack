"use client";

import { useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Level } from "@/types";
import { Trophy } from "lucide-react";
import { getLevelColor } from "@/lib/points-engine";

interface LevelUpAnimationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newLevel: Level;
}

export function LevelUpAnimation({ open, onOpenChange, newLevel }: LevelUpAnimationProps) {
  const levelColor = getLevelColor(newLevel);

  useEffect(() => {
    if (open && typeof window !== "undefined") {
      // Trigger confetti animation if canvas-confetti is available
      import("canvas-confetti").then((confetti) => {
        confetti.default({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: [levelColor, "#FFD700", "#FFA500"],
        });
      });

      // Auto-close after 3 seconds
      const timer = setTimeout(() => {
        onOpenChange(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [open, levelColor, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <div className="text-center py-8">
          <div className="animate-bounce mb-4">
            <Trophy
              className="h-24 w-24 mx-auto"
              style={{ color: levelColor }}
            />
          </div>
          <h2 className="text-3xl font-bold mb-2">Level Up!</h2>
          <p className="text-gray-600 mb-4">You've reached</p>
          <div
            className="text-5xl font-bold mb-4"
            style={{ color: levelColor }}
          >
            {newLevel}
          </div>
          <p className="text-sm text-gray-500">
            Keep up the great work! 🎉
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

