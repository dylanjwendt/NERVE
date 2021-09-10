import { Actor, Engine, GameLogic} from "nerve-engine";
import DemoInputHandler from "./DemoInputHandler";
import PlayerActor from "./actors/Player";
import Player from "./actors/Player";
import Bullet from "./actors/Bullet";
import Blackhole from "./actors/Blackhole";
import WallPiece from "./actors/WallPiece";
import Matter from "matter-js";

export default class DemoEngine extends Engine {
    bh: Blackhole;
    bh2: Blackhole;

    constructor() {
        super((l: GameLogic) => new DemoInputHandler(l, this));
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

    addActor(id: number): void {
        super.addActor(id, new Player(id, "todo", this));
    }

    newPlayerActor(name = ""): number {
        const id = this.gameLogic.getValidID();
        const actor = new PlayerActor(id, name, this);
        this.addActor(actor.getID());
        return id;
    }

    getValidID(): number {
        return this.gameLogic.getValidID();
    }

    addBullet(bull: Bullet): void {
        this.gameLogic.addActor(bull.getID(), bull);
    }

    consumeBullet(bull: Bullet): void {
        this.gameLogic.removeActor(bull.getID());
    }

    removeWall(wall: WallPiece): void {
        this.gameLogic.removeActor(wall.getID());
    }
}

