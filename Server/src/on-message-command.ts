import { Command } from "@colyseus/command";
import { SimpleGameState } from "./simple-game-state";
import { WorldUpdate } from "./world/world-update";

export class OnMessageCommand extends Command<SimpleGameState, { userInput: string }> {
    private worldUpdate: WorldUpdate;

    constructor(worldUpdate?: WorldUpdate) {
        super();
        if (worldUpdate === undefined) {
            this.worldUpdate = new WorldUpdate();
        } 
        else {
            this.worldUpdate = worldUpdate;
        }
    }

    execute({ userInput }): void {
        // this.state.text = this.worldUpdate.processInput(userInput);
    }
}