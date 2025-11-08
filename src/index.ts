import { buildServer } from "./api/server";
import { runPollOnce } from "./ingest/poller";


const { app, server } = buildServer();
const PORT = Number(process.env.PORT || 3000);


server.listen(PORT, () => console.log(`listening ${PORT}`));


// simple interval poller
setInterval(() => runPollOnce(""), Number(process.env.POLL_INTERVAL_MS || 30000));


// run immediately once
runPollOnce("").catch(console.error);