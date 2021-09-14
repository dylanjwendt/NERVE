import { Engine, GameLogic} from "nerve-engine";
import DemoInputHandler from "./DemoInputHandler";
import PlayerActor from "./actors/Player";
import Player from "./actors/Player";
import Blackhole from "./actors/Blackhole";
import Matter from "matter-js";

export default class DemoEngine extends Engine {
    bh: Blackhole;
    bh2: Blackhole;

    constructor() {
        super((l: GameLogic) => new DemoInputHandler(l));
        this.bh = new Blackhole(this.gameLogic.getValidID(), "bh1", this);
        Matter.Body.setPosition(this.bh.body, Matter.Vector.create(500, 500));

        this.bh.setOrigin([500, 500]);
        this.gameLogic.addActor(this.bh.getID(), this.bh);

        this.bh2 = new Blackhole(this.gameLogic.getValidID(), "bh2", this);
        Matter.Body.setPosition(this.bh2.body, Matter.Vector.create(1000, 1000));

        this.bh2.setOrigin([500, 500]);
        this.gameLogic.addActor(this.bh2.getID(), this.bh2);

        (this.inputHandler as DemoInputHandler).setEngine(this);
    }

    update(millisec: number): void {
        this.bh.wander(millisec);
        this.bh2.wander(millisec);
        super.update(millisec);
    }

    addPlayerActor(id: number): void {
        super.addActor(id, new Player(id, this, "todo"));
    }

    getValidId(): number {
        return this.gameLogic.getValidID();
    }
}

