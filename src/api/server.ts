import Fastify from "fastify";
import { redis, KEY_TOKEN, ZSET_VOLUME } from "../cache/redis";
import { setupWS } from "../ws/ws";
import http from "http";


export function buildServer() {
const app = Fastify();
app.get("/tokens", async (req, reply) => {
const q = (req.query as any).q || "";
const limit = Number((req.query as any).limit || 20);
const cursor = (req.query as any).cursor || null;
// use zset range for stable ordering by volume desc
const start = cursor ? Number(cursor) : 0;
const end = start + limit - 1;
const ids = await redis.zrevrange(ZSET_VOLUME, start, end);
const items = await Promise.all(ids.map((id: string) => redis.get(KEY_TOKEN(id)).then(r => JSON.parse(r))));
const nextCursor = end + 1;
reply.send({ items, nextCursor: ids.length ? String(nextCursor) : null });
});


const server = http.createServer(app.server);
setupWS(server);
return { app, server };
}