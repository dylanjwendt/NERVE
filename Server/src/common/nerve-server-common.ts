import { Client, Room } from "colyseus.js";
import { GameState } from "../colyseus/game-state";

export class NerveServerCommon {
    private room?: Room;
    private colyseusClient?: Client;
    private ROOM_NAME = "mainroom";

    async connect(endpoint: string): Promise<void> {
        console.log(`connecting to game server at ${endpoint}...`);
        this.colyseusClient = new Client(endpoint);
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
}