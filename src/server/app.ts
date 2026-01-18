import { Elysia } from "elysia";
import { messages } from "@/server/modules/messages";
import { room } from "@/server/modules/room";

const app = new Elysia({ prefix: "/api" }).use(room).use(messages);

export default app;
