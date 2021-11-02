import { Client, Room } from "colyseus";
import { IEngine } from "../engine-interface/engine.interface";
import { GameState } from "./game-state";
import { delay, inject, injectable } from "tsyringe";
import { ColyseusRoom } from "./colyseus-room";

// this class exists inverts control because a colyseus Room is very hard to unit test
@injectable()
export class ServerRoomImpl {

    private engine: IEngine;
    private colyseusRoom: Room<GameState>;
    private PATCH_RATE = 1;
    private socketEngineIdMap;
    private roomName: string;

    constructor(@inject("Engine") engine: IEngine, 
                @inject(delay(() => ColyseusRoom)) colyseusRoom: ColyseusRoom, 
        socketEngineIdMap?: Map<string, number>) {
        this.engine = engine;
        this.colyseusRoom = colyseusRoom;
        if (socketEngineIdMap) {
            this.socketEngineIdMap = socketEngineIdMap;
        } else {
            this.socketEngineIdMap = new Map<string, number>();
        }
        this.roomName = "";  // room name will be updated later
    }

    public async onCreate(colyseusRoom: Room<GameState>): Promise<void> {
        colyseusRoom.setSimulationInterval((deltaTime) => this.update(deltaTime));
        colyseusRoom.setPatchRate(this.PATCH_RATE);
        colyseusRoom.setState(new GameState());
        colyseusRoom.onMessage("*", (client: Client, type: string | number, message: any) => {
            this.onMessage(type, message);
        });
    }

    public onMessage(type: string | number, message: string): void {
        const req = JSON.parse(message);
        if (type === "keydown") {
            this.engine.inputHandler.handleKeyDown(req.player, req.key); // Actor id MUST be equal to client id
        } else if(type === "keyup") {
            this.engine.inputHandler.handleKeyUp(req.player, req.key); // Actor id MUST be equal to client id
        } else if(type === "mousedown") {
            this.engine.inputHandler.handleMouseDownInput(req.player, req.mousePos);
        } else if (type === "changeNameNClass") {
            console.log("Player " + req.player + "has change there name and class to be " + req.name + " , " + req.classValue);
            this.engine.changeUsernameAndClass(req.player, req.name, req.classValue);
        }
    }

    public async onJoin(client: Client): Promise<void> {
        const id = this.engine.getValidId();
        this.engine.addPlayerActor(id);
        client.send("getPlayerId", id);
        client.send("requestUsername", id);
        this.socketEngineIdMap.set(client.id, id);
        console.log(`[${new Date().toLocaleTimeString()}] Player joined with id ${id}`);
        this.updateRoomInfo();
    }

    public async onLeave(client: Client): Promise<void> {
        const id = this.socketEngineIdMap.get(client.id);
        if(!id) { return; }
        this.engine.removeActor(id);
        console.log(`[${new Date().toLocaleTimeString()}] Player left with id ${id}`);
        this.updateRoomInfo();
    }

    public update(deltaTime: number): void {
        this.engine.update(deltaTime);
        this.colyseusRoom.state.text = JSON.stringify(this.engine.getWorldState());
    }

    public getPlayerCount(): number {
        return this.engine.getPlayerCount();
    }

    public setRoomName(name: string): void {
        this.roomName = name;
    }

    public updateRoomInfo(): void {
        const roomInfo = `${this.roomName} (${this.getPlayerCount()}/100 players)`;
        // update all connected clients so debug info is accurate
        this.colyseusRoom.broadcast("updateRoomInfo", roomInfo);
    }
}