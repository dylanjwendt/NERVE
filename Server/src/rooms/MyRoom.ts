// rooms/MyRoom.ts (server-side, room file)

import { Room, Client } from "colyseus";
import { GameState } from "./GameState";

export class MyRoom extends Room<GameState> {
    maxClients = 4;

    async onCreate(options: any): Promise<void> {
        this.setState(new GameState());
        this.onMessage("*", (client: Client, type: string | number, message: any) => {
            this.state.messages.push(message);
            this.broadcast(type, [client.sessionId, message], { except: client});
            console.log(`\nchat history:\n${this.state.messages.join("\n")}`);
        });
    }

    async onJoin(client: Client, options: any): Promise<void> {
        if (options.name) {
            this.state.players.push(options.name);
            const message = `${options.name} has joined the chat`;
            this.broadcast("basic", [client.sessionId, message]);
            this.state.messages.push(message);
        }
    }
}