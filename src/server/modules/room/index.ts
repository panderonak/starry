import Elysia, { t } from "elysia";
import { nanoid } from "nanoid";
import { ROOM_TIME_TO_LIVE_SECONDS } from "@/app/config";
import { realtime } from "@/lib/realtime";
import { redis } from "@/lib/redis";
import { authMiddleware } from "@/server/modules/auth";

export const room = new Elysia({ prefix: "/room" })
  .post("/create", async () => {
    const roomId = nanoid();

    await Promise.all([
      redis.hset(`meta:${roomId}`, {
        connected: [],
        createdAt: Date.now(),
      }),

      redis.expire(`meta:${roomId}`, ROOM_TIME_TO_LIVE_SECONDS),
    ]);

    return { roomId };
  })
  .use(authMiddleware)
  .get(
    "/ttl",
    async ({ auth }) => {
      const ttl = await redis.ttl(`meta:${auth.roomId}`);

      return { ttl: ttl > 0 ? ttl : 0 };
    },
    {
      query: t.Object({
        roomId: t.String(),
      }),
    },
  )
  .delete(
    "/",
    async ({ auth }) => {
      await realtime
        .channel(auth.roomId)
        .emit("chat.destroy", { isDestroyed: true });

      await Promise.all([
        redis.del(auth.roomId),
        redis.del(`meta:${auth.roomId}`),
        redis.del(`messages:${auth.roomId}`),
      ]);
    },
    {
      query: t.Object({
        roomId: t.String(),
      }),
    },
  );
