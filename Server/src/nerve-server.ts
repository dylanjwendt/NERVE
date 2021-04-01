import http from "http";
import { Server as ColyseusServer } from "colyseus";
import { MainRoom } from "./main-room";

// const gameServer = new Server({
//     server: http.createServer()
// });

// gameServer.define("my_room", MyRoom);

// gameServer.listen(2567);
// console.log("listening on ws://localhost:2567");

export class NerveServer {

    private colyseus: ColyseusServer;

    constructor(colyseus?: ColyseusServer) {
        if (colyseus) {
            this.colyseus = colyseus;
        } 
        else {
            this.colyseus = new ColyseusServer();
        }
    }

    public start(host: string, port: number): void {
        this.colyseus.attach({
            server: http.createServer()
        });
        // const gameServer = new this.colyseus({
        // host: "";  // TODO
        // port: 0;  // TODO
        // server: http.createServer()
        // });
        this.colyseus.define("mainroom", MainRoom);
        this.colyseus.listen(port, host);
        console.log(`listening on ws://${host}:${port}`);
    }
}