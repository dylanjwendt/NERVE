import { Room, Client } from "colyseus";
import { GameState } from "./game-state";
import { ServerRoomImpl } from "./server-room-impl";
import { delay, inject, injectable } from "tsyringe";
import { DemoEngine } from "nerve-demo";

// this class needs to exist in order for colyseus matchmaking to create it behind the scenes.
// it's been turned into a shell that just defers to our implementation
@injectable()
export class ColyseusRoom extends Room<GameState> {

    private room: ServerRoomImpl;

    constructor(@inject("Room") room: ServerRoomImpl) {
        super();
        this.room = new ServerRoomImpl(new DemoEngine(), this);
    }

    async onCreate(options: any): Promise<void> {
        this.room.onCreate(this);
    }

    async onJoin(client: Client, options: any): Promise<void> {
        if (options.isObserver) {
            // allow "observers" to look at the room without joining as a player
            // observers can update the room name and player count
            this.room.setRoomName(options.roomName);
            this.room.updateRoomInfo();
            return;
        }
        await this.room.onJoin(client);
    }

    async onLeave(client: Client): Promise<void> {
        await this.room.onLeave(client);
    }

    update(deltaTime: number): void {
        this.room.update(deltaTime);
    }

    public getPlayerCount(): number {
        return this.room.getPlayerCount();
    }
}