import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Page = () => {
  return (
    <section className="mx-auto px-4 py-20 md:py-32 bg-accent-foreground h-screen">
      <div className="max-w-5xl mx-auto text-center space-y-8 flex items-center justify-center flex-col h-full">
        <h1 className="mb-6 text-6xl font-semibold tracking-tight text-foreground italic">
          Starry
        </h1>
        <h2 className="text-5xl font-semibold text-foreground text-balance leading-tight">
          Private conversations that vanish in{" "}
          <span className="text-primary italic font-extrabold underline">
            10 minutes.
          </span>
        </h2>
        <p className="text-xl/7 text-gray-600 max-w-prose text-center text-pretty">
          Self-destructing chat rooms with zero data retention. No accounts, no
          history.
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <Link
            href="/lobby"
            className={cn(
              buttonVariants({
                size: "lg",
              }), "text-md px-8 py-4 hover:scale-[1.02]",
            )}
          >
            Create a room
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Page;
