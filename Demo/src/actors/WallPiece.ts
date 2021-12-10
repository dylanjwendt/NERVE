import { Body, Bodies, Events } from "matter-js";
import { Actor } from "nerve-engine";
import DemoEngine from "../DemoEngine";

const maxAge = 6000;

export default class WallPiece extends Actor {
    #deltaT: number;

    /**
     * 
     * @param id Numeric ID value of WallPiece. Only use the getValidID() function of engine to get values for this.
     * @param name Name of piece to be displayed
     * @param engine reference to DemoEngine
     */
    constructor(id: number, name = "", engine: DemoEngine) {
        super(id, name, Bodies.circle(0,0,24), engine, "bot_player.png");
        this.setScale([1.5, 1.5]);
        this.setWidth(48);
        this.setHeight(48);
        this.#deltaT = 0;
        this.body.collisionFilter.mask = 0b1<<3; 
        this.body.collisionFilter.category = 0b1<<3;
        Body.setStatic(this.body, true);
        function decay(event: Matter.IEventTimestamped<Matter.Engine>, thisPiece: WallPiece) {
            const millisec = thisPiece.engine.engine.timing.lastDelta;

            if(thisPiece.#deltaT >= maxAge) {
                thisPiece.destroy();
                return;
            }
            thisPiece.#deltaT += millisec;
        }
        Events.on(this.engine.engine, "afterUpdate", (e) => decay(e, this));
    }
}
