"use client";

import { DestroyRoomButton } from "@/components/destroy-room-button";
import { RoomIdField } from "@/components/room-id-field";
import { SelfDestructionTimer } from "@/components/self-destruction-timer";

interface HeaderProps {
  roomId: string;
  timeRemaining: number | null;
}

export function Header({ roomId, timeRemaining }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b px-3 py-2.5 sm:px-4 sm:py-3 bg-white/50 backdrop-blur-md">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-6">
          <RoomIdField roomId={roomId} />

          <SelfDestructionTimer timeRemaining={timeRemaining} />

          <DestroyRoomButton roomId={roomId} />
        </div>
      </div>
    </header>
  );
}
