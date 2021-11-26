import { Client, Room } from "colyseus.js";
import { GameState } from "../colyseus/game-state";

/**
 * Common code that the client uses to commicate to the server
 */
export class NerveServerCommon {
    private room?: Room;
    private colyseusClient?: Client;

    /**
     * Connect a client to a server (endpoint) and join the given room
     * @param endpoint The server's location
     * @param room The room the client wishes to join
     */
    async connect(endpoint: string, room: string): Promise<void> {
        console.log(`connecting to game server at ${endpoint}...`);
        this.colyseusClient = new Client(endpoint);
        console.log(`joining room ${room}`);
        if (room.includes("default")) {
            room = await this.findLeastPopulatedRoom();
        }
        this.room = await this.colyseusClient.joinOrCreate<GameState>(room);
        console.log("connected");
    }

    /**
     * Send a given message to the server
     * @param messageType The type of message to be sent
     * @param message The contents of the message to be sent
     */
    send(messageType: string, message: string): void {
        console.log(`sending message to server: ${message}`);
        if (this.room === undefined) {
            throw new Error("haven't connected to a room yet");
        } 
        this.room.send(messageType, message);
    }

    /**
     * Triggered when the server sends a message back to the client
     * @param messageType The type of message being sent by the server
     * @param callback The function to which the message contents go to
     */
    onMessage(messageType: string, callback: (message: any) => void): void {
        this.room?.onMessage(messageType, callback);
    }

    /**
     * Triggered when state of the game is updated (such as postion updates and removing/adding actors)
     * @param callback The function in which the server calls when the game updates
     */
    onStateChange(callback: (state: GameState) => void): void {
        if (this.room !== undefined) {
            this.room.onStateChange(callback);
        }
    }

    /**
     * Used to leave the server, not yet implemented.
     * @param consented True if the leave was approved, false otherwise
     */
    leave(consented: boolean): void {
        throw new Error("Method not implemented.");
    }

    /**
     * Finds the least populated room/lobby and returns it.
     * @returns The least populated
     */
    private async findLeastPopulatedRoom(): Promise<string> {
        const response = await fetch("api/listRooms");
        const availableRooms = await response.json();
        let minRoom = "";
        let minSize = 100;  // just any large number
        availableRooms.forEach(room => {
            if (room.playerCount < minSize) {
                minRoom = room.name;
                minSize = room.playerCount;
            }
        });
        return minRoom;
    }
}