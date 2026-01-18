import { treaty } from "@elysiajs/eden";
import type { App } from "@/server/types";

export const api = treaty<App>("localhost:3000").api;
