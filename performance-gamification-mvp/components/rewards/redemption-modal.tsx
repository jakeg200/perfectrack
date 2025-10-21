"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Reward } from "@/types";

interface RedemptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reward: Reward | null;
  userPoints: number;
  onConfirm: () => void;
}

export function RedemptionModal({
  open,
  onOpenChange,
  reward,
  userPoints,
  onConfirm,
}: RedemptionModalProps) {
  if (!reward) return null;

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Redemption</DialogTitle>
          <DialogDescription>
            Are you sure you want to redeem this reward?
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="text-center">
            <div className="text-6xl mb-4">{reward.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {reward.name}
            </h3>
            <p className="text-sm text-gray-600 mb-6">{reward.description}</p>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Cost:</span>
                <span className="font-semibold text-primary">
                  {reward.pointCost} points
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Your points:</span>
                <span className="font-semibold text-gray-900">
                  {userPoints} points
                </span>
              </div>
              <div className="border-t pt-2 flex items-center justify-between text-sm">
                <span className="text-gray-600">After redemption:</span>
                <span className="font-semibold text-gray-900">
                  {userPoints - reward.pointCost} points
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Confirm Redemption
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

