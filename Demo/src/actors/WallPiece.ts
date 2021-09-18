import Matter from "matter-js";
import { Actor } from "nerve-engine";
import { DemoEngine } from "..";

const maxAge = 6000;

export default class WallPiece extends Actor {
    #deltaT: number;

    constructor(id: number, name = "", engine: DemoEngine) {
        super(id, name, Matter.Bodies.circle(0,0,24), engine);
        this.setScale([1.5, 1.5]);
        this.setWidth(48);
        this.setHeight(48);
        this.#deltaT = 0;
        this.body.collisionFilter.mask = 0b1<<3; 
        this.body.collisionFilter.category = 0b1<<3;
        Matter.Body.setStatic(this.body, true);
        function decay(event: Matter.IEventTimestamped<Matter.Engine>, thisPiece: WallPiece) {
            const millisec = thisPiece.engine.engine.timing.lastDelta;

            if(thisPiece.#deltaT >= maxAge) {
                thisPiece.destroy();
                return;
            }
            thisPiece.#deltaT += millisec;
        }
        Matter.Events.on(this.engine.engine, "afterUpdate", (e) => decay(e, this));
    }
}
