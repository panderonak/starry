"use client";

import { Check, Copy } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCopyLink } from "@/hooks/use-copy-link";

export function CopyButton() {
  const { copyLink, copyStatus } = useCopyLink();
  return (
    <Tooltip>
      <TooltipTrigger
        onClick={copyLink}
        className={buttonVariants({
          variant: "outline",
          size: "xs",
        })}
      >
        {copyStatus === "copied" ? (
          <Check className="size-3.5" />
        ) : (
          <Copy className="size-3.5" />
        )}
        {/* <Button variant={"outline"} size={"xs"} > */}
        {/* </Button> */}
      </TooltipTrigger>
      <TooltipContent>
        <p>{copyStatus === "copied" ? "Yanked" : "Yank"}</p>
      </TooltipContent>
    </Tooltip>
  );
}
