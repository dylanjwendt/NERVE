import { Dispatcher } from "@colyseus/command";
import { Room, Client } from "colyseus";
import { OnMessageCommand } from "./on-message-command";
import { SimpleGameState } from "./simple-game-state";

export class MainRoom extends Room<SimpleGameState> {
    dispatcher = new Dispatcher(this);

    async onCreate(options: any): Promise<void> {
        this.setState(new SimpleGameState());
        this.onMessage("*", (client: Client, type: string | number, message: any) => {
            this.dispatcher.dispatch(new OnMessageCommand(), {
                userInput: message
            });
        });
    }

    onDispose(): void {
        this.dispatcher.stop();
    }
}