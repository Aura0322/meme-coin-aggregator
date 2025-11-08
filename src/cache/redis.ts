import IORedis from "ioredis";
export const redis = new IORedis(process.env.REDIS_URL || "redis://127.0.0.1:6379");
export const DEFAULT_TTL = Number(process.env.DEFAULT_TTL || 30);
export const KEY_TOKEN = (addr: string) => `token:${addr}`;
export const ZSET_VOLUME = "z:volume"; // sorted set for volume-based sorting