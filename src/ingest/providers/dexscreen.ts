import { fetchWithRetry } from "../../utils/httpClient";
import { Token } from "../../types/token";


export async function fetchDexScreenerSearch(q: string): Promise<Token[]> {
const url = `https://api.dexscreener.com/latest/dex/search?q=${encodeURIComponent(q)}`;
const data: any = await fetchWithRetry(url);
// dex screener search returns `pairs`. map to Token minimally
const pairs = data?.pairs || [];
return pairs.map((p: any) => ({
token_address: p?.baseToken?.address || p?.token?.address,
token_name: p?.baseToken?.name || p?.token?.name,
token_ticker: p?.baseToken?.symbol || p?.token?.symbol,
price_sol: Number(p?.priceUsd || 0),
volume_sol: Number(p?.volumeUsd || 0),
source_meta: { dexscreener: { last_updated: Date.now(), raw: p } }
}));
}


export async function fetchDexScreenerToken(tokenAddr: string): Promise<Token | null> {
const url = `https://api.dexscreener.com/latest/dex/tokens/${tokenAddr}`;
const data: any = await fetchWithRetry(url);
const base = data?.pairs?.[0];
if (!base) return null;
return {
token_address: tokenAddr,
token_name: base?.baseToken?.name,
token_ticker: base?.baseToken?.symbol,
price_sol: Number(base?.priceUsd || 0),
volume_sol: Number(base?.volumeUsd || 0),
source_meta: { dexscreener: { last_updated: Date.now(), raw: data } }
};
}