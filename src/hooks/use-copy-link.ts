import { useState } from "react";

export const useCopyLink = () => {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");

  const copyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);

    setCopyStatus("copied");
    setTimeout(() => setCopyStatus("idle"), 2000);
  };

  return { copyLink, copyStatus };
};
