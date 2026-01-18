import Elysia from "elysia";
import { redis } from "@/lib/redis";
import { AUTH_ERROR } from "@/server/modules/auth/service";

export const authMiddleware = new Elysia({
  name: "auth",
})
  /**
   * Register custom error type
   */
  .error({ AUTH_ERROR })
  /**
   * Global error handler for this middleware
   * Runs whenever an AUTH_ERROR is thrown
   */
  .onError(({ code, status }) => {
    if (code === "AUTH_ERROR") {
      return status(401, "Unauthorized");
    }
  })
  /**
   * It runs on every request
   * - It extracts the auth-related data (roomId and token) from the request
   * - Validates the token against Redis
   * - Attaches the result to the request context for later use
   */
  .derive({ as: "scoped" }, async ({ query, cookie }) => {
    const roomId = query.roomId;

    const token = cookie["x-auth-token"].value as string | undefined;

    if (!roomId || !token) throw new AUTH_ERROR("Missing room id or token");

    const connected = await redis.hget<string[]>(`meta:${roomId}`, "connected");

    if (!connected?.includes(token)) throw new AUTH_ERROR("Invalid token");

    return { auth: { roomId, token, connected } };
  });
