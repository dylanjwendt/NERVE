import { Server, matchMaker } from "colyseus";
import { Client } from "colyseus.js";
import { ColyseusRoom } from "./colyseus-room";
import { GameState } from "./game-state";
import { ServerRoomImpl } from "./server-room-impl";

/**
 * Manages the lobbies/rooms of the server.
 */
export class RoomManager {
    private colyseusServer: Server;
    private colyseusClient: Client;
    private rooms: any[];

    /**
     * Creates a new RoomManager
     * @param colyseusServer The host of the rooms
     * @param colyseusClient The user of the rooms
     */
    constructor(colyseusServer: Server, colyseusClient: Client) {
        this.colyseusServer = colyseusServer;
        this.colyseusClient = colyseusClient;
        this.rooms = [
            {name: "us-west-1", playerCount: 0, capacity: 100},
            {name: "us-west-2", playerCount: 0, capacity: 100},
            {name: "us-east-1", playerCount: 0, capacity: 100},
            {name: "us-east-2", playerCount: 0, capacity: 100},
            {name: "ca-central-1", playerCount: 0, capacity: 100},
            {name: "eu-west-1", playerCount: 0, capacity: 100},
            {name: "eu-central-1", playerCount: 0, capacity: 100},
            {name: "eu-east-1", playerCount: 0, capacity: 100},
            {name: "moon", playerCount: 0, capacity: 100},
            {name: "ap-northeast-1", playerCount: 0, capacity: 100},
            {name: "sa-east-1", playerCount: 0, capacity: 100},
        ];
    }

    /**
     * Setups each room in the room manger
     */
    public initRooms() : void {
        this.rooms.forEach(room => {
            this.colyseusServer.define(room.name, ColyseusRoom);
        });
    }

    /**
     * Update the player count for each room in the server.
     */
    private async updateRoomPlayerCounts() {
        this.rooms.forEach(async (room) => {
            // join the room so we can get a look at the player count
            const roomJoinOptions = {isObserver: true, roomName: `${room.name}`};
            const colyseusRoom = await this.colyseusClient.joinOrCreate<GameState>(room.name, roomJoinOptions);
            const roomId = colyseusRoom.id;
            // use colyseus remote call 
            const currentPlayerCount = await matchMaker.remoteRoomCall(roomId, "getPlayerCount");
            room.playerCount = currentPlayerCount;
            // leave the room so we don't leave unnecessary connections
            colyseusRoom.leave();
        });
    }

    /**
     * 
     * @returns Returns a list of all the rooms after checking for updated player count
     */
    public async listRooms(): Promise<any[]> {
        await this.updateRoomPlayerCounts();
        return this.rooms;
    }
} 