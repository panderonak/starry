import { treaty } from "@elysiajs/eden";
import type { App } from "@/server/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export const api = treaty<App>(API_URL).api;
