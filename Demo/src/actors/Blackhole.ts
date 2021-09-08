import Matter from "matter-js";
import { Actor,} from "nerve-engine";
import { DemoEngine } from "..";
import Impact from "../interactions/bhImpact";
import Bullet from "./Bullet";

const THRESHOLD = 30;
const WANDERRANGE = 300;
const DECISIONINTERVAL = 2000;

export default class Blackhole extends Actor {
    private entityCount;
    #engine: DemoEngine;
    #origin: [number, number];
    #deltaT: number;

    constructor(id: string, name = "", eng: DemoEngine) {
        super(id, name, Matter.Bodies.circle(0,0,48));
        this.setScale([1.5, 1.5]);
        this.setWidth(48);
        this.setHeight(48);
        this.setTint(0x000000);
        this.entityCount = 0;
        this.#engine = eng;
        this.addInteraction(new Impact());
        this.#origin = [0,0];
        this.#deltaT = DECISIONINTERVAL+1;
        this.body.collisionFilter.mask = 0x800;
        this.body.collisionFilter.category = ~0x800;
    }

    objectImpact(other: Actor): void {
        if(other instanceof Bullet) {
            this.#engine.consumeBullet(other);
            this.entityCount++;
            //Handle threshold explosion
            if(this.entityCount >= THRESHOLD)
            {
                this.explode();
                this.entityCount = 0;
            }
        }
    }

    wander(millisec: number): void {
        if(this.#deltaT >= DECISIONINTERVAL)
        {
            const offsetx = ((Math.random()*2)-1)*WANDERRANGE;
            const offsety = ((Math.random()*2)-1)*WANDERRANGE;
            const tgt = {x: this.#origin[0]+offsetx, y: this.#origin[1] +offsety};
            const deltax = tgt.x-this.body.position.x;
            const deltay = tgt.y-this.body.position.y;
            const vx = deltax/(DECISIONINTERVAL/1000);
            const vy = deltay/(DECISIONINTERVAL/1000);
            Matter.Body.setVelocity(this.body, Matter.Vector.create(vx, vy));
            this.#deltaT = 0;    
        }
        else
        {
            this.#deltaT += millisec;
        }
        console.log("Delta: %s\nPosition: %s\nVelocity: %s\n\n", millisec, this.body.position, this.body.velocity);
    }

    explode(): void {
        const bhPos = [this.body.position.x, this.body.position.y] as [number, number];
        for(let i = 0; i < THRESHOLD; i++) {
            const theta = ((360/THRESHOLD)*i)*Math.PI/180;
            const pos = [bhPos[0] + Math.cos(theta), bhPos[1] + Math.sin(theta)] as [number, number];

            const bullet = new Bullet(this.#engine.getValidID(), null, bhPos, pos);
            bullet.setTint(0xa30207);
            this.#engine.addBullet(bullet);
        }
    }

    setOrigin(newOrigin: [number, number]): void {
        this.#origin = newOrigin;
    }
}
