import "reflect-metadata";  // for dependency injection
import { Server } from "colyseus";
import { Client } from "colyseus.js";  // "client-side" client
import { container } from "tsyringe";
import { ServerRoomImpl } from "./colyseus/server-room-impl";
import { DemoEngine } from "nerve-demo";
import { ServerConfig } from "./server-config";
import { ColyseusRoom } from "./colyseus/colyseus-room";
import { INerveServer } from "./nerve-server.interface";
import { NerveServer } from "./nerve-server";
import { NerveConfig } from "nerve-common";

/**
 * Sets up dependency injection for the server
 */
export class Startup {
    public static start(): INerveServer {

        // register interfaces
        const serverConfig: ServerConfig = {host: NerveConfig.server.hostName, port: NerveConfig.server.port};
        container.register("Config", {useValue: serverConfig});

        const colyseusClient = new Client(`ws://${serverConfig.host}:${serverConfig.port}`);
        container.register("ColyseusClient", {useValue: colyseusClient});

        const colyseusServer = new Server();
        container.register("ColyseusServer", {useValue: colyseusServer});

        // register normal 
        container.register("ColyseusServer", {useClass: Server});
        container.register("Engine", {useClass: DemoEngine});
        container.register("ColyseusRoom", {useClass: ColyseusRoom});
        container.register("Room", {useClass: ServerRoomImpl});
        container.register("NerveServer", {useClass: NerveServer});

        return container.resolve("NerveServer");
    }
}