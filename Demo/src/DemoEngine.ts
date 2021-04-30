import { Engine, World, GameLogic, EuclideanCoordinates } from "nerve-engine";
import DemoInputHandler from "./DemoInputHandler";
import PlayerActor from "./actors/Player";
import Player from "./actors/Player";
import Bullet from "./actors/Bullet";
import Blackhole from "./actors/Blackhole";
import WallPiece from "./actors/WallPiece";

export default class DemoEngine extends Engine {
    constructor() {
        super((w: World, l: GameLogic) => new DemoInputHandler(w, l));
        const bh = new Blackhole(this.gameLogic.getValidID(), "bh1", this);
        bh.setCoords(new EuclideanCoordinates(500, 500));
        bh.setOrigin(new EuclideanCoordinates(500, 500));
        this.gameLogic.addActor(bh.getID(), bh);
        const bh2 = new Blackhole(this.gameLogic.getValidID(), "bh2", this);
        bh2.setCoords(new EuclideanCoordinates(500, 500));
        bh2.setOrigin(new EuclideanCoordinates(500, 500));
        this.gameLogic.addActor(bh2.getID(), bh2);
        (this.inputHandler as DemoInputHandler).setEngine(this);
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

    consumeBullet(bull: Bullet): void {
        this.gameLogic.removeActor(bull.getID());
    }

    removeWall(wall: WallPiece): void {
        this.gameLogic.removeActor(wall.getID());
    }
}

