import { Bodies, Body, Vector } from "matter-js";
import { Actor,} from "nerve-engine";
import { DemoEngine } from "..";
import Attractor from "../interactions/Attract";
import Impact from "../interactions/bhImpact";
import Bullet from "./Bullet";

const THRESHOLD = 30;
const WANDERRANGE = 300;
const DECISIONINTERVAL = 2000;

export default class Blackhole extends Actor {
    private entityCount;
    #origin: [number, number];
    #deltaT: number;
    #tgt: {x: number, y: number};

    /**
     * 
     * @param id Numeric ID Value of black hole. Only use the getValidID() function of engine to get values for this.
     * @param name Name of object for display
     * @param eng Reference to the DemoEngine
     */
    constructor(id: number, name = "", eng: DemoEngine) {
        super(id, name, Bodies.circle(0,0,24), eng, "circle.png");
        this.setScale([1.5, 1.5]);
        this.setWidth(48);
        this.setHeight(48);
        this.setTint(0x000000);
        this.entityCount = 0;
        this.addInteraction(new Impact());
        this.addInteraction(new Attractor(this));
        this.#origin = [0,0];
        this.#deltaT = DECISIONINTERVAL+1;
        this.body.collisionFilter.mask = 0b1<<3;
        this.body.collisionFilter.category = 0b1<<2;
        this.#tgt = {x: 0,y: 0};
    }

    /**
     * Destroy bullet objects which hits the blackhole. Explodes when a critical threshold is met.
     * @param other Object which impacts the blackhole
     */
    objectImpact(other: Actor): void {
        if(other instanceof Bullet) {
            other.destroy();
            this.entityCount++;
            //Handle threshold explosion
            if(this.entityCount >= THRESHOLD)
            {
                this.explode();
                this.entityCount = 0;
            }
        }
    }

    /**
     * Move randomly within local region
     * @param millisec Duration in time since last wander operation
     */
    wander(millisec: number): void {
        this.#deltaT += millisec;
        if(this.#deltaT >= DECISIONINTERVAL)
        {
            const offsetx = ((Math.random()*2)-1)*WANDERRANGE;
            const offsety = ((Math.random()*2)-1)*WANDERRANGE;
            this.#tgt = {x: this.#origin[0]+offsetx, y: this.#origin[1] +offsety};
            this.#deltaT = 0;    
        }
        else
        {
            const deltax = this.#tgt.x-this.body.position.x;
            const deltay = this.#tgt.y-this.body.position.y;
            const vx = deltax/((2*DECISIONINTERVAL - this.#deltaT)/1000);
            const vy = deltay/((2*DECISIONINTERVAL - this.#deltaT)/1000);
            Body.setVelocity(this.body, Vector.create(vx, vy));
        }
    }

    /**
     * Fire a set of bullets outwards from center.
     */
    explode(): void {
        const bhPos = [this.body.position.x, this.body.position.y] as [number, number];
        for(let i = 0; i < THRESHOLD; i++) {
            const theta = ((360/THRESHOLD)*i)*Math.PI/180;
            const pos = [bhPos[0] + Math.cos(theta), bhPos[1] + Math.sin(theta)] as [number, number];

            const bullet = new Bullet(this.engine.gameLogic.getValidID(), null, bhPos, pos, this.engine.engine, this.engine.gameLogic, this.engine);
            bullet.setTint(0xa30207);
            this.engine.addActor(bullet.body.id, bullet);
        }
    }

    /**
     * Change tether position the black hole wanders around.
     * @param newOrigin set of 2 numbers representing the x,y position for tether.
     */
    setOrigin(newOrigin: [number, number]): void {
        this.#origin = newOrigin;
    }
}
