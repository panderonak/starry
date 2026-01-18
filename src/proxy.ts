import { nanoid } from "nanoid";
import { type NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const room = pathname.match(/^\/room\/([^/]+)$/);

  if (!room) return NextResponse.redirect(new URL("/lobby", request.url));

  const roomId = room[1];

  const meta = await redis.hgetall<{
    connected: string[];
    createdAt: number;
  }>(`meta:${roomId}`);

  if (!meta) {
    return NextResponse.redirect(new URL("/room-not-found", request.url));
  }

  const existingToken = request.cookies.get("x-auth-token")?.value;

  if (existingToken && meta.connected.includes(existingToken)) {
    return NextResponse.next();
  }

  if (meta.connected.length >= 2) {
    return NextResponse.redirect(new URL("/limit-reached", request.url));
  }

  const token = nanoid();

  const response = NextResponse.next();

  response.cookies.set("x-auth-token", token, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  await redis.hset(`meta:${roomId}`, {
    connected: [...meta.connected, token],
  });

  return response;
}

export const config = {
  matcher: "/room/:path*",
};
