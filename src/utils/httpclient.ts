import axios from "axios";
import pRetry from "p-retry";


export async function fetchWithRetry(url: string, opts: any = {}) {
return pRetry(
async () => {
const res = await axios.get(url, { timeout: 8000, ...opts });
if (res.status === 429) {
const ra = res.headers["retry-after"];
if (ra) throw new pRetry.AbortError("429 with Retry-After");
throw new Error("429");
}
if (res.status >= 500) throw new Error("server error");
return res.data;
},
{ retries: 3, factor: 2, minTimeout: 300 }
);
}