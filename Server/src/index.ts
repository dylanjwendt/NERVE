// index.ts (server-side, entrypoint)

import http from "http";
import { Server } from "colyseus";
import { MyRoom } from "./rooms/MyRoom";

const gameServer = new Server({
    server: http.createServer()
});

gameServer.define("my_room", MyRoom);

gameServer.listen(2567);
console.log("listening on ws://localhost:2567");