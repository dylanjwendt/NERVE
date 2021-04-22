import { Dispatcher } from "@colyseus/command";
import { Room, Client } from "colyseus";
import { SimpleGameState } from "./simple-game-state";
import DemoEngine from "../../Demo/src/DemoEngine";

export class MainRoom extends Room<SimpleGameState> {
    dispatcher = new Dispatcher(this);
    engine: DemoEngine;

    constructor() {
        super();
        this.engine = new DemoEngine();
    }

    async onCreate(options: any): Promise<void> {
        this.setSimulationInterval((deltaTime) => this.update(deltaTime));
        this.setPatchRate(1);
        this.setState(new SimpleGameState());
        this.onMessage("*", (client: Client, type: string | number, message: any) => {
            const req = JSON.parse(message);
            if(type === "keydown") {
                this.engine.inputHandler.handleKeyDown(req.player, req.key); // Actor ID MUST be equal to client id
            } else if(type === "keyup") {
                this.engine.inputHandler.handleKeyUp(req.player, req.key); // Actor ID MUST be equal to client id
            } else if(type === "mousedown") {
                this.engine.inputHandler.handleMouseDownInput(req.player, req.mousePos);
            }
        });
    }

    async onJoin(client: Client, options: any): Promise<void> {
        this.engine.addActor(client.id);
        client.send("getPlayerId", client.id);
        console.log(`[${new Date().toLocaleTimeString()}] Player joined with id ${client.id}`);
    }

    async onLeave(client: Client): Promise<void> {
        this.engine.removeActor(client.id);
        console.log(`[${new Date().toLocaleTimeString()}] Player left with id ${client.id}`);
    }

    update(deltaTime: number): void {
        this.engine.update(deltaTime);
        this.state.text = JSON.stringify(this.engine.getWorldState());
    }

    onDispose(): void {
        this.dispatcher.stop();
    }
}