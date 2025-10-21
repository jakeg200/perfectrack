"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { KPIType, Achievement, User } from "@/types";
import { KPI_LABELS, DEFAULT_POINTS_CONFIG } from "@/lib/constants";

interface LogAchievementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (achievement: Omit<Achievement, "id" | "timestamp" | "approved">) => void;
  currentUser: User;
}

export function LogAchievementModal({
  open,
  onOpenChange,
  onSubmit,
  currentUser,
}: LogAchievementModalProps) {
  const [kpiType, setKpiType] = useState<KPIType>("task_completed");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    onSubmit({
      userId: currentUser.id,
      type: kpiType,
      description: description.trim(),
      points: DEFAULT_POINTS_CONFIG[kpiType],
    });

    // Reset form
    setDescription("");
    setKpiType("task_completed");
    onOpenChange(false);
  };

  const kpiTypes: KPIType[] = [
    "task_completed",
    "sales_win",
    "attendance",
    "peer_kudos",
    "innovation",
    "customer_satisfaction",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Achievement</DialogTitle>
          <DialogDescription>
            Record your accomplishment and earn points
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Achievement Type
              </label>
              <Select
                value={kpiType}
                onChange={(e) => setKpiType(e.target.value as KPIType)}
              >
                {kpiTypes.map((type) => (
                  <option key={type} value={type}>
                    {KPI_LABELS[type]} (+{DEFAULT_POINTS_CONFIG[type]} pts)
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Description
              </label>
              <Input
                placeholder="Describe what you accomplished..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Points to earn:</span>
                <span className="font-bold text-blue-700 text-lg">
                  +{DEFAULT_POINTS_CONFIG[kpiType]}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!description.trim()}>
              Log Achievement
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

