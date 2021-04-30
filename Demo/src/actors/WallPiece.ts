import { Actor, Vec2, EuclideanCoordinates } from "nerve-engine";
import { DemoEngine } from "..";
import Bounce from "../interactions/bounce";
import Damage from "../interactions/Damage";
import Player from "./Player";

const maxAge = 5000;

export default class WallPiece extends Actor {
    #deltaT: number;
    #engine: DemoEngine;

    constructor(id: string, name = "", engine: DemoEngine) {
        super(id, name);
        this.setScale([1.5, 1.5]);
        this.setWidth(48);
        this.setHeight(48);
        this.#deltaT = 0;
        this.#engine = engine;
    }

    moveTimestep(millisec: number) {
        if(this.#deltaT >= maxAge) {
            this.#engine.removeWall(this);
            return;
        }
        this.#deltaT += millisec;
    }
}
