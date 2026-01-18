import { notFound } from "next/navigation";
import { Room } from "@/components/room";

interface RoomContentProps {
  params: Promise<{ roomId: string | undefined }>;
}

export async function RoomContent({ params }: RoomContentProps) {
  const { roomId } = await params;

  if (!roomId) return notFound();
  return <Room roomId={roomId} />;
}
