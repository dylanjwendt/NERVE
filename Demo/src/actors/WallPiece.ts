import Matter from "matter-js";
import { Actor } from "nerve-engine";
import { DemoEngine } from "..";
import Damage from "../interactions/Damage";
import Player from "./Player";

const maxAge = 5000;

export default class WallPiece extends Actor {
    #deltaT: number;
    #engine: DemoEngine;

    constructor(id: string, name = "", engine: DemoEngine) {
        super(id, name, Matter.Bodies.polygon(0,0,6,48));
        this.setScale([1.5, 1.5]);
        this.setWidth(48);
        this.setHeight(48);
        this.#deltaT = 0;
        this.#engine = engine;
        Matter.Body.setStatic(this.body, true);
        function decay(event: Matter.IEventTimestamped<Matter.Engine>, thisPiece: WallPiece) {
            const millisec = thisPiece.#engine.engine.timing.lastDelta;

            if(thisPiece.#deltaT >= maxAge) {
                thisPiece.#engine.removeWall(thisPiece);
                return;
            }
            thisPiece.#deltaT += millisec;
        }
        Matter.Events.on(this.#engine.engine, "afterUpdate", (e) => decay(e, this));
    }
}
