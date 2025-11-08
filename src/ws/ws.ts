import { Server as IOServer } from "socket.io";
import http from "http";
import IORedis from "ioredis";


export function setupWS(server: http.Server) {
const io = new IOServer(server, { path: "/ws" });
const sub = new IORedis(process.env.REDIS_URL || "redis://127.0.0.1:6379");
sub.subscribe("tokens:updates");
sub.on("message", (ch, msg) => {
try {
const parsed = JSON.parse(msg);
io.emit("token:update", parsed);
} catch (e) {}
});


io.on("connection", (socket) => {
socket.on("subscribe", (filter) => {
socket.data.filter = filter;
});
});
}