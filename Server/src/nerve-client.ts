import { INerveClient } from "./nerve-client.interface";
import { Room } from "colyseus.js";
import { Client } from "colyseus.js";
import { SimpleGameState } from "./simple-game-state";

export class NerveClient implements INerveClient {
    private room?: Room<SimpleGameState>;
    private colyseusClient?: Client;

    constructor(colyseusClient?: Client) {
        this.colyseusClient = colyseusClient;
    }

    async connect(endpoint: string): Promise<void> {
        console.log(`connecting to game server at ${endpoint}...`);
        if (this.colyseusClient === undefined) {
            this.colyseusClient = new Client(endpoint);
        }
        this.room = await this.colyseusClient.joinOrCreate<SimpleGameState>("mainroom");
        console.log("connected");
    }
    send(message: string): void {
        console.log(`sending message to server: ${message}`);
        if (this.room === undefined) {
            throw new Error("haven't connected to a room yet");
        } 
        this.room.send("main", message);
    }
    onStateChange(callback: (state: SimpleGameState) => void): void {
        if (this.room !== undefined) {
            this.room.onStateChange(callback);
        }
    }
    leave(consented: boolean): void {
        throw new Error("Method not implemented.");
    }

    // just for unit tests
    getRoom(): Room<SimpleGameState> | undefined {
        return this.room;
    }
}