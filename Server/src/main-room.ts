import { Dispatcher } from "@colyseus/command";
import { Room, Client } from "colyseus";
import { OnMessageCommand } from "./on-message-command";
import { SimpleGameState } from "./simple-game-state";
import { WorldUpdate } from "./world/world-update";

export class MainRoom extends Room<SimpleGameState> {
    dispatcher = new Dispatcher(this);
    worldUpdate: WorldUpdate = new WorldUpdate();

    async onCreate(options: any): Promise<void> {
        this.setSimulationInterval((deltaTime) => this.update(deltaTime));
        this.setPatchRate(1);
        this.setState(new SimpleGameState());
        this.onMessage("*", (client: Client, type: string | number, message: any) => {
            this.worldUpdate.processInput(type as string, message);
            // this.dispatcher.dispatch(new OnMessageCommand(this.worldUpdate), {
            // userInput: message
            // });
        });
    }

    async onJoin(client: Client, options: any): Promise<void> {
        const playerId: string = this.worldUpdate.addPlayer(client.id);
        client.send("getPlayerId", playerId);
    }

    async onLeave(client: Client): Promise<void> {
        this.worldUpdate.removePlayer(client.id);
    }

    update(deltaTime: number): void {
        this.state.text = this.worldUpdate.update(deltaTime);
    }

    onDispose(): void {
        this.dispatcher.stop();
    }
}