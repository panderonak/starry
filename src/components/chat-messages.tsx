import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { SendHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUsername } from "@/hooks/use-username";
import { api } from "@/lib/eden";
import { getInitials } from "@/lib/initials";
import { useRealtime } from "@/lib/realtime-client";
import { cn } from "@/lib/utils";

interface ChatMessagesProps {
  roomId: string;
}

export function ChatMessages({ roomId }: ChatMessagesProps) {
  const { username } = useUsername();

  const { data: messages, refetch } = useQuery({
    queryKey: ["messages", roomId],
    queryFn: async () => {
      const res = await api.messages.get({
        query: { roomId },
      });
      return res.data;
    },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async ({ text }: { text: string }) => {
      await api.messages.post(
        { sender: username, text },
        { query: { roomId } },
      );
      setInput("");
      inputRef.current?.focus();
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    },
  });

  const router = useRouter();

  useRealtime({
    channels: [roomId],
    events: ["chat.destroy", "chat.message"],
    onData: ({ event }) => {
      if (event === "chat.message") {
        refetch();
      }
      if (event === "chat.destroy") {
        router.push("/lobby");
        toast.warning("All messages were permanently deleted.");
      }
    },
  });

  return (
    <div className="flex flex-col h-full max-h-screen overflow-hidden">
      <div className="flex flex-1 flex-col overflow-y-auto py-4 px-7 space-y-4 gap-4 h-full">
        {messages?.messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-zinc-600 text-lg">
              No messages yet, start the conversation.
            </p>
          </div>
        )}
        {messages?.messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1],
              delay: 0.05,
            }}
            className={cn(
              "flex items-end gap-3",
              message.sender === username ? "flex-row-reverse" : "flex-row",
            )}
          >
            <Avatar className="size-8 shrink-0">
              <AvatarFallback
                className={cn(
                  "text-xs font-semibold",
                  message.sender === username
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {message.sender === username
                  ? "You"
                  : getInitials(message.sender)}
              </AvatarFallback>
            </Avatar>

            <div
              className={cn(
                "flex flex-col gap-1 max-w-[70%]",
                username === message.sender ? "items-end" : "items-start",
              )}
            >
              <div className="flex items-center gap-2 px-1">
                <span className="text-xs font-medium text-muted-foreground">
                  {message.sender === username ? "You" : message.sender}
                </span>
                <span className="text-sm text-muted-foreground/60">
                  {format(message.timestamp, "HH:mm")}
                </span>
              </div>
              <div
                className={cn(
                  "rounded-2xl px-4 py-2.5 wrap-break-word",
                  message.sender === username
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted text-foreground rounded-bl-md",
                )}
              >
                <p className="text-sm leading-relaxed font-semibold">
                  {message.text}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="border-t bg-card p-4"
      >
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <motion.span
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-green-800 text-xl font-mono"
            >
              {">"}
            </motion.span>
            <Input
              ref={inputRef}
              type="text"
              placeholder="Type message..."
              className="pl-8 bg-background border-input focus-visible:ring-1 focus-visible:ring-ring transition-all h-10 font-semibold"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && input.trim()) {
                  sendMessage({ text: input });
                }
              }}
            />
          </div>
          <Button
            size={"icon"}
            onClick={() => sendMessage({ text: input })}
            disabled={!input.trim() || isPending}
            className="shrink-0 size-10 transition-all hover:scale-105 active:scale-95"
          >
            <motion.div
              whileHover={{ x: 2 }}
              transition={{
                duration: 0.2,
              }}
            >
              <SendHorizontal className="size-4" />
            </motion.div>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
