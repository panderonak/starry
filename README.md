# ⭐ Starry — Self-Destructing Chat

A privacy-focused, real-time chat application where conversations vanish after **10 minutes**.  
No accounts. No history. No data retention.

## ✨ Features

- **Self-Destructing Rooms** — Automatically expire after 10 minutes
- **No Authentication Required** — No sign-up or login
- **Real-time Messaging** — Powered by Upstash Realtime
- **Zero Data Retention** — Redis TTL ensures automatic deletion
- **Anonymous Identities** — Random animal usernames
- **Modern UI** — Next.js 16, React 19, Tailwind CSS

## 🧱 Tech Stack

- **Framework**: Next.js 16 (React 19)
- **Backend API**: Elysia + Eden (type-safe)
- **Realtime**: Upstash Realtime
- **Database**: Upstash Redis
- **State Management**: TanStack Query
- **UI**: Tailwind CSS, shadcn/ui, Framer Motion
- **Tooling**: Biome, TypeScript


## 🗂️ Project Structure

```txt
src/
├── app/
│   ├── api/           # API routes
│   ├── lobby/         # Room creation page
│   ├── room/          # Chat room page
│   └── config.ts      # App configuration
├── components/
│   ├── ui/            # Reusable UI components
│   ├── chat-messages.tsx
│   ├── lobby.tsx
│   └── room.tsx
├── server/
│   ├── modules/
│   │   ├── auth/      # Authentication middleware
│   │   ├── messages/  # Message handling
│   │   └── room/      # Room management
│   └── app.ts         # Elysia server setup
└── lib/
    ├── redis.ts       # Redis client
    ├── realtime.ts    # Realtime client
    └── eden.ts        # Type-safe API client
````

## 🧠 Architecture & Flow

Visual overview of how Starry handles room access, authentication,
real-time messaging, and automatic data deletion.

> All data is temporary and expires automatically using Redis TTL.

### 🔐 Room Join & Authentication Flow

This diagram explains how users join rooms, how access is validated,
and how retries and capacity limits are handled.

- Room join and authentication flow



### 💬 Message Delivery & Realtime Flow

This diagram shows how messages are written once, broadcast in real time,
and automatically deleted after expiration.

- Message lifecycle and realtime flow


## 🔁 How It Works (Step by Step)

1. **Room Creation**
   A unique room ID is generated and stored in Redis with a 10-minute TTL.

2. **Joining a Room**
   Tokens are validated against Redis to allow join, rejoin, or rejection.

3. **Sending Messages**
   Messages are written to Redis and published via Upstash Realtime.

4. **Receiving Messages**
   Clients subscribe to the room channel and receive messages instantly.

5. **Auto-Destruction**
   When TTL expires, Redis deletes all room data automatically.

## ⚙️ Prerequisites

* Bun (recommended) or Node.js 20+
* Upstash account (Redis + Realtime)

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

UPSTASH_REALTIME_URL=
UPSTASH_REALTIME_TOKEN=
```

## 🚀 Installation & Running Locally

```bash
git clone <repo-url>
cd starry
bun install
bun dev
```

Open: [http://localhost:3000](http://localhost:3000)

## 📄 License

MIT License

