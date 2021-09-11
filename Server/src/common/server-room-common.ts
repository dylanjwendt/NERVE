import { Client, Room } from "colyseus";
import { IEngine } from "../engine-interface/engine.interface";
import { GameState } from "../colyseus/game-state";
import { DemoEngine } from "nerve-demo";

export class ServerRoomCommon extends Room<GameState> {

    private engine: IEngine;
    private PATCH_RATE = 1;
    private socketEngineIdMap = new Map<string, number>();

    constructor() {
        super();
        console.log("here");
        this.engine = new DemoEngine();
    }

    async onCreate(options: any): Promise<void> {
        this.setSimulationInterval((deltaTime) => this.update(deltaTime));
        this.setPatchRate(this.PATCH_RATE);
        this.setState(new GameState());
        this.onMessage("*", (client: Client, type: string | number, message: any) => {
            const req = JSON.parse(message);
            if (type === "keydown") {
                this.engine.inputHandler.handleKeyDown(req.player, req.key); // Actor ID MUST be equal to client id
            } else if(type === "keyup") {
                this.engine.inputHandler.handleKeyUp(req.player, req.key); // Actor ID MUST be equal to client id
            } else if(type === "mousedown") {
                this.engine.inputHandler.handleMouseDownInput(req.player, req.mousePos);
            } else if (type === "username") {
                console.log("Player " + req.player + " is now called " + req.name);
            }
        });
    }

    async onJoin(client: Client, options: any): Promise<void> {
        const id = this.engine.getValidId();
        this.engine.addActor(id);
        client.send("getPlayerId", id);
        console.log(`[${new Date().toLocaleTimeString()}] Player joined with id ${id}`);
    }

    async onLeave(client: Client): Promise<void> {
        const id = this.socketEngineIdMap.get(client.id);
        if(!id) { return; }
        this.engine.removeActor(id);
        console.log(`[${new Date().toLocaleTimeString()}] Player left with id ${id}`);
    }

    update(deltaTime: number): void {
        this.engine.update(deltaTime);
        this.state.text = JSON.stringify(this.engine.getWorldState());
    }
}