import http from "http";
import { INerveServer } from "./nerve-server.interface";
import { Client, Room } from "colyseus.js";
import { WebSocketTransport } from "@colyseus/ws-transport";
import { Server } from "colyseus";
import { GameState } from "./colyseus/game-state";
import { inject, injectable } from "tsyringe";
import { ColyseusRoom } from "./colyseus/colyseus-room";
import { ServerConfig } from "./server-config";

/**
 * The primary nerve server
 */
@injectable()
export class NerveServer implements INerveServer {
    private colyseusServer: Server;
    private colyseusClient: Client;
    private config: ServerConfig;
    private isInitialized: boolean;
    private room?: Room;
    private ROOM_NAME = "mainroom";

    constructor(@inject("ColyseusClient") colyseusClient: Client, 
                @inject("ColyseusServer") colyseusServer: Server, 
                @inject("Config") config: ServerConfig) {
        this.colyseusServer = colyseusServer;
        this.colyseusClient = colyseusClient;
        this.config = config;
        this.room = undefined;
        this.isInitialized = false;
    }

    async init(): Promise<void> {
        this.colyseusServer.attach({
            transport: new WebSocketTransport({
                server: http.createServer()
            })
        });
        this.colyseusServer.define(this.ROOM_NAME, ColyseusRoom);
        this.colyseusServer.listen(this.config.port, this.config.host);
        console.log(`listening on ws://${this.config.host}:${this.config.port}`);
    }

    async connect(endpoint: string): Promise<void> {
        if (!this.isInitialized) {
            await this.init();
        }
        console.log(`connecting to game server at ${endpoint}...`);
        // our colyseus client already knows the endpoint
        this.room = await this.colyseusClient.joinOrCreate<GameState>(this.ROOM_NAME);
        console.log("connected");
    }

    send(messageType: string, message: string): void {
        console.log(`sending message to server: ${message}`);
        if (this.room === undefined) {
            throw new Error("haven't connected to a room yet");
        } 
        this.room.send(messageType, message);
    }

    // this event is triggered when the server sends a message back to the client
    onMessage(messageType: string, callback: (message: any) => void): void {
        this.room?.onMessage(messageType, callback);
    }

    onStateChange(callback: (state: GameState) => void): void {
        if (this.room !== undefined) {
            this.room.onStateChange(callback);
        }
    }

    leave(consented: boolean): void {
        throw new Error("Method not implemented.");
    }

    onDispose(): void {
        this.colyseusServer.gracefullyShutdown();
    }
}