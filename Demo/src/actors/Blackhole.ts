import { Actor, EuclideanCoordinates, Vec2 } from "nerve-engine";
import { DemoEngine } from "..";
import Attract from "../interactions/attract";
import Impact from "../interactions/bhImpact";
import Bullet from "./Bullet";

const THRESHOLD = 30;
const WANDERRANGE = 300;
const DECISIONINTERVAL = 2000;

export default class Blackhole extends Actor {
    private entityCount;
    #engine: DemoEngine;
    #origin: EuclideanCoordinates;
    #deltaT: number;

    constructor(id: string, name = "", eng: DemoEngine) {
        super(id, name);
        this.setScale([1.5, 1.5]);
        this.setWidth(48);
        this.setHeight(48);
        this.setTint(0x000000);
        this.entityCount = 0;
        this.#engine = eng;
        this.addInteraction(new Attract());
        this.addInteraction(new Impact());
        this.#origin = new EuclideanCoordinates(0,0);
        this.#deltaT = DECISIONINTERVAL+1;
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

    moveTimestep(millisec: number): void {
        if(this.#deltaT >= DECISIONINTERVAL)
        {
            const offsetx = ((Math.random()*2)-1)*WANDERRANGE;
            const offsety = ((Math.random()*2)-1)*WANDERRANGE;
            const tgt = new Vec2(this.#origin.toVector().x+offsetx, this.#origin.toVector().y+offsety);
            const deltax = tgt.x-this.getCoords().toVector().x;
            const deltay = tgt.y-this.getCoords().toVector().y;
            const vx = deltax/(DECISIONINTERVAL/1000);
            const vy = deltay/(DECISIONINTERVAL/1000);
            this.setVelocity(new Vec2(vx, vy));        
            this.#deltaT = 0;    
        }
        else
        {
            this.#deltaT += millisec;
        }
        super.moveTimestep(millisec);
    }

    explode(): void {
        const bhPos = [this.getCoords().toVector().x, this.getCoords().toVector().y] as [number, number];
        for(let i = 0; i < THRESHOLD; i++) {
            const theta = ((360/THRESHOLD)*i)*Math.PI/180;
            const pos = [bhPos[0] + Math.cos(theta), bhPos[1] + Math.sin(theta)] as [number, number];

            const bullet = new Bullet(this.#engine.getValidID(), null, bhPos, pos);
            bullet.setTint(0xa30207);
            this.#engine.addBullet(bullet);
        }
    }

    setOrigin(newOrigin: EuclideanCoordinates): void {
        this.#origin = newOrigin;
    }
}
