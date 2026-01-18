"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useUsername } from "@/hooks/use-username";
import { api } from "@/lib/eden";

export function Lobby() {
  const { username } = useUsername();

  const router = useRouter();

  const { mutate: createRoom, isPending: isCreating } = useMutation({
    mutationFn: async () => {
      const res = await api.room.create.post();
      if (res.status === 200) {
        toast.success(`Room created successfully ✌🏻 -> [${res.status}]`);
        router.push(`/room/${res.data?.roomId}`);
      } else {
        toast.error(`Can't create a room -> ${res.error} [${res.status}]`);
      }
    },
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Card className="relative w-full max-w-sm overflow-hidden">
        <CardHeader>
          <CardTitle>Create a Room</CardTitle>
          <CardDescription>
            Start a new private chat room that self-destructs after 10 minutes.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <div className="flex flex-col gap-y-3 w-full">
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg w-full">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">
                  You&apos;ll join as
                </p>
                <p className="text-sm font-medium truncate">{username}</p>
              </div>
            </div>

            <Button
              className="w-full"
              size={"lg"}
              disabled={isCreating}
              onClick={() => createRoom()}
            >
              {isCreating ? (
                <>
                  <Spinner />
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}
