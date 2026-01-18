"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { api } from "@/lib/eden";
import { ChatMessages } from "./chat-messages";

interface RoomProps {
  roomId: string;
}

export function Room({ roomId }: RoomProps) {
  const router = useRouter();
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  const { data: ttlData } = useQuery({
    queryKey: ["time-to-live", roomId],
    queryFn: async () => {
      const res = await api.room.ttl.get({
        query: { roomId },
      });

      return res.data;
    },
  });

  // This effect runs whenever `ttlData` changes.
  // Its job is to sync the server-provided TTL
  // (time to live) into local state.
  useEffect(() => {
    if (ttlData?.ttl !== undefined) {
      setTimeRemaining(ttlData.ttl);
    }
  }, [ttlData]);

  // This effect controls the countdown timer.
  // It decreases `timeRemaining` every second
  // and redirects the user when time runs out.
  useEffect(() => {
    if (timeRemaining === null || timeRemaining < 0) return;

    if (timeRemaining === 0) {
      router.push("/lobby");
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup function:
    // Runs when the effect re-runs or the component unmounts.
    // This prevents multiple intervals from running at once.
    return () => clearInterval(interval);
  }, [timeRemaining, router]);

  return (
    <main className="flex flex-col h-screen max-h-screen overflow-hidden">
      <Header roomId={roomId} timeRemaining={timeRemaining} />
      <ChatMessages roomId={roomId} />
    </main>
  );
}
