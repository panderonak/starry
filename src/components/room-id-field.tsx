"use client";

import { CopyButton } from "@/components/copy-button";
import { Badge } from "@/components/ui/badge";

interface RoomIdProps {
  roomId: string;
}

export function RoomIdField({ roomId }: RoomIdProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-2.5">
      <span className="shrink-0 whitespace-nowrap text-[9px] font-medium uppercase tracking-wider text-muted-foreground sm:text-[10px] md:text-xs">
        ROOM ID
      </span>
      <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2">
        <Badge
          variant={"secondary"}
          className="max-w-50 truncate px-3 py-1 font-mono text-sm sm:max-w-none"
        >
          {roomId}
        </Badge>

        <CopyButton />
      </div>
    </div>
  );
}
