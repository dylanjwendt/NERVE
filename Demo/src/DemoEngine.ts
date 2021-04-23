import { Engine, World, GameLogic } from "nerve-engine";
import DemoInputHandler from "./DemoInputHandler";
import PlayerActor from "./actors/Player";
import Player from "./actors/Player";

export default class DemoEngine extends Engine {
    constructor() {
        super((w: World, l: GameLogic) => new DemoInputHandler(w, l));
    }

    addActor(id: string): void {
        super.addActor(id, new Player(id, "todo"));
    }

    newPlayerActor(name = ""): string {
        const id = this.gameLogic.getValidID();
        const actor = new PlayerActor(id, name);
        this.addActor(actor.getID().toString());
        return id;
    }
}

