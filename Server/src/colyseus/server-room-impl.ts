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

    constructor(@inject("Engine") engine: IEngine, 
                @inject(delay(() => ColyseusRoom)) colyseusRoom: ColyseusRoom) {
        this.engine = engine;
        this.colyseusRoom = colyseusRoom;
        this.socketEngineIdMap = new Map<string, number>();
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
        } else if (type === "username") {
            console.log("Player " + req.player + " is now called " + req.name);
        }
    }

    public async onJoin(client: Client): Promise<void> {
        const id = this.engine.getValidId();
        this.engine.addActor(id);
        client.send("getPlayerId", id);
        this.socketEngineIdMap.set(client.id, id);
        console.log(`[${new Date().toLocaleTimeString()}] Player joined with id ${id}`);
    }

    public async onLeave(client: Client): Promise<void> {
        const id = this.socketEngineIdMap.get(client.id);
        if(!id) { return; }
        this.engine.removeActor(id);
        console.log(`[${new Date().toLocaleTimeString()}] Player left with id ${id}`);
    }

    public update(deltaTime: number): void {
        this.engine.update(deltaTime);
        this.colyseusRoom.state.text = JSON.stringify(this.engine.getWorldState());
    }
}