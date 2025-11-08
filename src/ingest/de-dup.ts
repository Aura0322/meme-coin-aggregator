import { Token } from "../types/token";
export function mergeTokens(existing: Token | null, incoming: Token): Token {
if (!existing) return incoming;
return {
...existing,
token_name: existing.token_name || incoming.token_name,
token_ticker: existing.token_ticker || incoming.token_ticker,
price_sol: incoming.price_sol ?? existing.price_sol,
market_cap_sol: incoming.market_cap_sol ?? existing.market_cap_sol,
volume_sol: (existing.volume_sol || 0) + (incoming.volume_sol || 0),
liquidity_sol: incoming.liquidity_sol ?? existing.liquidity_sol,
transaction_count: incoming.transaction_count ?? existing.transaction_count,
price_1hr_change: incoming.price_1hr_change ?? existing.price_1hr_change,
source_meta: { ...(existing.source_meta || {}), ...(incoming.source_meta || {}) }
};
}