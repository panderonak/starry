"use client";

import { Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatTimeRemaining } from "@/lib/time";

interface SelfDestructionTimerProps {
  timeRemaining: number | null;
}

export function SelfDestructionTimer({
  timeRemaining,
}: SelfDestructionTimerProps) {
  const isCritical = timeRemaining !== null && timeRemaining < 60;

  return (
    <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
      <div className="flex items-center gap-2">
        <Timer className="size-4 text-muted-foreground" />

        <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
          Self-Destruct
        </span>
      </div>

      <Badge
        variant={isCritical ? "destructive" : "secondary"}
        className="font-mono px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs"
      >
        {timeRemaining !== null
          ? formatTimeRemaining(timeRemaining)
          : "-- : --"}
      </Badge>
    </div>
  );
}
