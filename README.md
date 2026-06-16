# Starry

Starry is a private, real-time chat app for short-lived conversations. Create a
room, share its link with one other person, and chat until the room
self-destructs after 10 minutes.

Messages, room metadata, and access tokens are stored temporarily in Upstash
Redis and expire with the room. No account or sign-in is required.

## Features

- Real-time messaging for two participants
- Rooms that automatically expire after 10 minutes
- One-click room links for inviting another participant
- Anonymous, randomly generated usernames
- Manual room destruction that immediately removes room data
- Cookie-based room access with no account system
- Type-safe API calls with Elysia and Eden

## Tech Stack

- [Next.js 16](https://nextjs.org/) and React 19
- [Elysia](https://elysiajs.com/) and [Eden](https://elysiajs.com/eden/overview)
- [Upstash Redis](https://upstash.com/docs/redis) and
  [Upstash Realtime](https://upstash.com/docs/realtime)
- [TanStack Query](https://tanstack.com/query/latest)
- Tailwind CSS 4 and shadcn/ui
- Framer Motion
- TypeScript, Biome, and Bun

## How It Works

1. A participant creates a room from the lobby.
2. Starry stores the room metadata in Redis with a 10-minute TTL.
3. Opening a valid room link assigns the browser an HTTP-only access token.
4. Up to two browser tokens can join the room.
5. Messages are stored in Redis and broadcast over Upstash Realtime.
6. Redis automatically removes room data when its TTL expires, or a
   participant can destroy the room immediately.

## 🧠 Architecture & Flow

Visual overview of how Starry handles room access, authentication,
real-time messaging, and automatic data deletion.

> All data is temporary and expires automatically using Redis TTL.

### Room Join & Authentication Flow

This diagram explains how users join rooms, how access is validated,
and how retries and capacity limits are handled.

<img width="1405" height="2600" alt="Realtime Chat - Proxy" src="https://github.com/user-attachments/assets/a8c886aa-dade-42c6-8273-6f3707e52c60" />

### Message Delivery & Realtime Flow

This diagram shows how messages are written once, broadcast in real time,
and automatically deleted after expiration.

<img width="1881" height="827" alt="Realtime Chat - Message" src="https://github.com/user-attachments/assets/bcf9df08-c1e9-451a-843a-5bd3b4ec46ce" />

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/)
- An [Upstash Redis](https://console.upstash.com/) database

### Installation

```bash
git clone https://github.com/panderonak/starry.git
cd starry
bun install
```

Create a `.env.local` file in the project root:

```env
UPSTASH_REDIS_REST_URL="your-upstash-redis-rest-url"
UPSTASH_REDIS_REST_TOKEN="your-upstash-redis-rest-token"
```

Start the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `UPSTASH_REDIS_REST_URL` | Yes | REST URL for the Upstash Redis database |
| `UPSTASH_REDIS_REST_TOKEN` | Yes | REST token for the Upstash Redis database |
| `NEXT_PUBLIC_API_URL` | Production | Public base URL used by the Eden API client; defaults to `http://localhost:3000` |

For a deployed app, set `NEXT_PUBLIC_API_URL` to its public origin, such as
`https://starry.example.com`.

## Available Scripts

```bash
bun dev       # Start the Next.js development server
bun run build # Create a production build
bun start     # Start the production server
bun run lint  # Run Biome checks
bun run format # Format the codebase with Biome
```

## Project Structure

```text
src/
├── app/                    # Next.js pages and route handlers
│   ├── api/                # Elysia API and Realtime endpoints
│   ├── lobby/              # Room creation page
│   └── room/[roomId]/      # Chat room page
├── components/             # Chat UI and reusable components
├── hooks/                  # Client-side username and clipboard hooks
├── lib/                    # Redis, Realtime, and Eden clients
├── server/
│   ├── modules/auth/       # Room-token authorization
│   ├── modules/messages/   # Message storage and broadcasting
│   └── modules/room/       # Room creation, TTL, and destruction
└── proxy.ts                # Room validation, capacity checks, and token setup
```

## API Overview

All API routes are served beneath `/api`.

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/room/create` | Create a new room |
| `GET` | `/api/room/ttl?roomId=...` | Get a room's remaining lifetime |
| `DELETE` | `/api/room?roomId=...` | Destroy a room and notify participants |
| `GET` | `/api/messages?roomId=...` | Get the room's messages |
| `POST` | `/api/messages?roomId=...` | Send a message |
| `GET` | `/api/realtime` | Connect to Upstash Realtime events |

Except for room creation, room and message endpoints require the HTTP-only
`x-auth-token` cookie assigned when a participant opens a valid room URL.

## Configuration

The room lifetime is defined by `ROOM_TIME_TO_LIVE_SECONDS` in
`src/app/config.ts`. The current value is 600 seconds.

## Notes

- Starry is designed for temporary conversations, not durable storage.
- The room capacity is enforced per browser token, not per individual person.
- A participant returning with the same valid cookie can re-enter the room.

## 📄 License

MIT License
