import { Suspense } from "react";
import { RoomContent } from "@/components/room-content";
import { Spinner } from "@/components/ui/spinner";

interface PageProps {
  params: Promise<{
    roomId: string | undefined;
  }>;
}

const Page = async ({ params }: PageProps) => {
  return (
    <Suspense fallback={<RoomContentSkeleton />}>
      <RoomContent params={params} />
    </Suspense>
  );
};

export default Page;

export function RoomContentSkeleton() {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <Spinner />
    </div>
  );
}
