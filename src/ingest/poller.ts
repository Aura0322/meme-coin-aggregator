import { fetchDexScreenerSearch } from "./providers/dexscreener";
import { redis, DEFAULT_TTL, KEY_TOKEN, ZSET_VOLUME } from "../cache/redis";
import { mergeTokens } from "./de-dup";
import { Token } from "../types/token";


export async function runPollOnce(query = "") {
const tokens = await fetchDexScreenerSearch(query);
for (const t of tokens) {
const key = KEY_TOKEN(t.token_address);
const raw = await redis.get(key);
const existing = raw ? JSON.parse(raw) as Token : null;
const merged = mergeTokens(existing, t);
await redis.set(key, JSON.stringify(merged), "EX", DEFAULT_TTL);
// update sorted set for volume
const vol = merged.volume_sol || 0;
await redis.zadd(ZSET_VOLUME, vol.toString(), t.token_address);
await redis.publish("tokens:updates", JSON.stringify({ token_address: t.token_address, price_sol: merged.price_sol, volume_sol: merged.volume_sol }));
}
}