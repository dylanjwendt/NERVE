import Engine from "../engine";
import World from "../world";
import PlayerInputHandler from "./PlayerInputHandler";
import PlayerActor from "./PlayerActor";

export default class DemoEngine extends Engine{
    
    constructor() {
        super((a) => new PlayerInputHandler(a));
    }

    handleKeyInput(pid: number, key: string): void {
        throw new Error("Method not implemented.");
    }

    handleMouseDownInput(ActorID: number, pos: [number, number]): void {
        throw new Error("Method not implemented.");
    }

    handleMouseUpInput(ActorID: number, pos: [number, number]): void {
        throw new Error("Method not implemented.");
    }
    
    handleMouseMoveInput(ActorID: number, pos: [number, number]): void {
        throw new Error("Method not implemented.");
    }

    newPlayerActor(name = ""): number {
        const id = this.gameLogic.getValidID();
        const actor = new PlayerActor(id, name);
        this.addNewActor(actor.getID(), actor);
        return id;
    }
}

