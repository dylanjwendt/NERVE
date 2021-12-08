import http from "http";
import { INerveServer } from "./nerve-server.interface";
import { Client, Room } from "colyseus.js";
import { WebSocketTransport } from "@colyseus/ws-transport";
import { Server } from "colyseus";
import { GameState } from "./colyseus/game-state";
import { inject, injectable } from "tsyringe";
import { ColyseusRoom } from "./colyseus/colyseus-room";
import { ServerConfig } from "./server-config";
import { RoomManager } from "./colyseus/room-manager";

@injectable()
/**
 * The primary nerve server which is responiable for the processing and sending
 * communications between client and engine.
 */
export class NerveServer implements INerveServer {
    /** The main server */
    private colyseusServer: Server;
    /** The client server */
    private colyseusClient: Client;
    /** The server configuration */
    private config: ServerConfig;
    /** True if the server is initialized, false otherwise */
    private isInitialized: boolean;
    /** The place where the client and server communicate*/
    private room?: Room;
    /** The room name */
    private ROOM_NAME = "mainroom";
    /** Manages the rooms that the server currently has set up */
    private roomManager: RoomManager;

    /**
     * Creates a new nerver server
     * @param colyseusClient The client server
     * @param colyseusServer The main server
     * @param config The configuration of the server
     */
    constructor(@inject("ColyseusClient") colyseusClient: Client, 
                @inject("ColyseusServer") colyseusServer: Server, 
                @inject("Config") config: ServerConfig) {
        this.colyseusServer = colyseusServer;
        this.colyseusClient = colyseusClient;
        this.config = config;
        this.room = undefined;
        this.isInitialized = false;
        this.roomManager = new RoomManager(this.colyseusServer, this.colyseusClient);
    }

    /**
     * Starts the server based on the config information.
     */
    async init(): Promise<void> {
        this.colyseusServer.attach({
            transport: new WebSocketTransport({
                server: http.createServer()
            })
        });
        this.roomManager.initRooms();
        this.colyseusServer.listen(this.config.port, this.config.host);
        console.log(`listening on ws://${this.config.host}:${this.config.port}`);
    }

    /**
     * Adds a client connect between the server and the game
     * @param endpoint The client's address
     */
    async connect(endpoint: string): Promise<void> {
        if (!this.isInitialized) {
            await this.init();
        }
        console.log(`connecting to game server at ${endpoint}...`);
        // our colyseus client already knows the endpoint
        this.room = await this.colyseusClient.joinOrCreate<GameState>(this.ROOM_NAME);
        console.log("connected");
    }

    /**
     * Sends a message type and message to every client in the room
     * @param messageType The type of message, like warnings or commands
     * @param message The contents of the message
     */
    send(messageType: string, message: string): void {
        console.log(`sending message to server: ${message}`);
        if (this.room === undefined) {
            throw new Error("haven't connected to a room yet");
        } 
        this.room.send(messageType, message);
    }

    /**
     * Triggered when the server sends a message back to the client.
     * @param messageType The type of message the server sent
     * @param callback The callback function for the client, triggered when the message is sent
     */
    onMessage(messageType: string, callback: (message: any) => void): void {
        this.room?.onMessage(messageType, callback);
    }

    /**
     * To be triggered when the game state changes, such as position updates
     * or entities being added/removed
     * @param callback The callback function when such event occurs
     */
    onStateChange(callback: (state: GameState) => void): void {
        if (this.room !== undefined) {
            this.room.onStateChange(callback);
        }
    }

    /**
     * To be triggered when the client leaves the game. Not yet implemented
     * @param consented True if the client disconnect on purpose, false otherwise
     */
    leave(consented: boolean): void {
        throw new Error("Method not implemented.");
    }

    /**
     * Shuts down the server properly.
     */
    onDispose(): void {
        this.colyseusServer.gracefullyShutdown();
    }

    /**
     * Get a list of all the rooms/lobbies the server has opened
     * @returns The list of rooms/lobbies the server has opened
     */
    async listRooms(): Promise<any[]> {
        return await this.roomManager.listRooms();
    }
}