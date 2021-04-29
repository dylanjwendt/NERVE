import { Engine, World, GameLogic, EuclideanCoordinates } from "nerve-engine";
import DemoInputHandler from "./DemoInputHandler";
import PlayerActor from "./actors/Player";
import Player from "./actors/Player";
import Bullet from "./actors/Bullet";
import Blackhole from "./actors/Blackhole";

export default class DemoEngine extends Engine {
    constructor() {
        super((w: World, l: GameLogic) => new DemoInputHandler(w, l));
        const bh = new Blackhole(this.gameLogic.getValidID(), "bh1", this);
        bh.setCoords(new EuclideanCoordinates(300, 300));
        this.gameLogic.addActor(bh.getID(), bh);
        console.log("init");
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

    getValidID(): string {
        return this.gameLogic.getValidID();
    }

    addBullet(bull: Bullet): void {
        this.gameLogic.addActor(bull.getID(), bull);
    }
}

