import Elysia, { status, t } from "elysia";
import { nanoid } from "nanoid";
import { type Message, realtime } from "@/lib/realtime";
import { redis } from "@/lib/redis";
import { authMiddleware } from "@/server/modules/auth";
import { messageModel } from "@/server/modules/messages/model";

export const messages = new Elysia({ prefix: "/messages" })
  .use(authMiddleware)
  .use(messageModel)
  .post(
    "/",
    async ({ body, auth }) => {
      const { sender, text } = body;
      const { roomId } = auth;

      const roomExists = await redis.exists(`meta:${roomId}`);

      if (!roomExists) throw status("Not Found", "Room not found");

      const message: Message = {
        id: nanoid(),
        roomId,
        token: auth.token,
        sender,
        text,
        timestamp: Date.now(),
      };

      await Promise.all([
        await redis.rpush(`messages:${roomId}`, {
          ...message,
        }),
        await realtime.channel(roomId).emit("chat.message", message),
      ]);

      const remaining = await redis.ttl(`meta:${roomId}`);

      await Promise.all([
        redis.expire(`messages:${roomId}`, remaining),
        redis.expire(`history:${roomId}`, remaining),
        redis.expire(roomId, remaining),
      ]);
    },
    {
      query: t.Object({
        roomId: t.String(),
      }),
      body: "message.body",
    },
  )
  .get(
    "/",
    async ({ auth }) => {
      const messages = await redis.lrange<Message>(
        `messages:${auth.roomId}`,
        0,
        -1,
      );

      return {
        messages: messages.map((message) => ({
          ...message,
          token: message.token === auth.token ? auth.token : undefined,
        })),
      };
    },
    {
      query: t.Object({
        roomId: t.String(),
      }),
    },
  );
