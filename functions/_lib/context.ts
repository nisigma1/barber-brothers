import type { CloudflareEnv } from "./types";

export type PagesContext = {
  env: CloudflareEnv;
  request: Request;
};
