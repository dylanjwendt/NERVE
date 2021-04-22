// import { Command } from "@colyseus/command";
// import { SimpleGameState } from "./simple-game-state";

// export class OnMessageCommand extends Command<SimpleGameState, { userInput: string }> {
//     private worldUpdate: WorldUpdate;

//     constructor(worldUpdate?: WorldUpdate) {
//         super();
//         if (worldUpdate === undefined) {
//             this.worldUpdate = new WorldUpdate();
//         } 
//         else {
//             this.worldUpdate = worldUpdate;
//         }
//     }

//     execute({ userInput }): void {
//         // this.state.text = this.worldUpdate.processInput(userInput);
//     }
// }