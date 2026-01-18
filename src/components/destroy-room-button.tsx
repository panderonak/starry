import { useMutation } from "@tanstack/react-query";
import { Bomb } from "lucide-react";
import { useRouter } from "next/navigation";
import { STORAGE_KEY } from "@/app/config";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/eden";

interface DestroyRoomButtonProps {
  roomId: string;
}

export function DestroyRoomButton({ roomId }: DestroyRoomButtonProps) {
  const router = useRouter();
  const { mutate: destroyRoom } = useMutation({
    mutationFn: async () => {
      await api.room.delete(null, {
        query: {
          roomId,
        },
      });

      localStorage.removeItem(STORAGE_KEY);
    },
    onSuccess: () => {
      router.push("/lobby");
    },
  });
  return (
    <div className="flex items-center gap-2 sm:gap-3 shrink-0 w-full sm:w-auto">
      <Button
        variant={"destructive"}
        size={"xs"}
        className="gap-1.5 sm:gap-2"
        onClick={() => destroyRoom()}
      >
        <Bomb className="size-4" />
        <span className="whitespace-nowrap">DESTROY NOW</span>
      </Button>
    </div>
  );
}
