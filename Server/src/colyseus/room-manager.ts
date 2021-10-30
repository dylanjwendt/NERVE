import { Server, matchMaker } from "colyseus";
import { Client } from "colyseus.js";
import { ColyseusRoom } from "./colyseus-room";
import { GameState } from "./game-state";
import { ServerRoomImpl } from "./server-room-impl";

export class RoomManager {
    private colyseusServer: Server;
    private colyseusClient: Client;
    private rooms: any[];

    constructor(colyseusServer: Server, colyseusClient: Client) {
        this.colyseusServer = colyseusServer;
        this.colyseusClient = colyseusClient;
        this.rooms = [
            {name: "utah", playerCount: 0, capacity: 100},
            {name: "nevada", playerCount: 0, capacity: 100},
            {name: "colorado", playerCount: 0, capacity: 100},
            {name: "washington", playerCount: 0, capacity: 100}
        ];
    }

    public initRooms() {
        this.rooms.forEach(room => {
            this.colyseusServer.define(room.name, ColyseusRoom);
        });
    }

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

    public async listRooms(): Promise<any[]> {
        await this.updateRoomPlayerCounts();
        return this.rooms;
    }
} 