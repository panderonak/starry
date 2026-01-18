import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const Page = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Card className="relative w-full max-w-sm overflow-hidden">
        <CardHeader className="text-center">
          <CardTitle>Room Not Found</CardTitle>
          <CardDescription>
            This room may have expired or never existed.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link
            href={"/lobby"}
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "lg",
              }),
              "w-full",
            )}
          >
            <>
              <ArrowLeft />
              Back
            </>
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
};

export default Page;
