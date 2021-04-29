import { Actor, Vec2 } from "nerve-engine";
import { DemoEngine } from "..";
import Attract from "../interactions/attract";
import Impact from "../interactions/bhImpact";
import Bullet from "./Bullet";
import * as postal from "postal";

const THRESHOLD = 30;

export default class Blackhole extends Actor {
    private entityCount;
    #engine: DemoEngine;
    #channel: any;

    constructor(id: string, name = "", eng: DemoEngine) {
        super(id, name);
        this.setScale([1.5, 1.5]);
        this.setWidth(48);
        this.setHeight(48);
        this.setTint(0x000000);
        this.entityCount = 0;
        this.#channel = postal.channel();
        this.#engine = eng;
        this.addInteraction(new Attract());
        this.addInteraction(new Impact());
    }

    objectImpact(other: Actor): void {
        if(other instanceof Bullet) {
            this.#channel.publish("Actor.Delete", {
                ActorID: other.getID(),
            });
            this.entityCount++;
            //Handle threshold explosion
            if(this.entityCount >= THRESHOLD)
            {
                this.explode();
                this.entityCount = 0;
            }
        }
    }

    explode(): void {
        const bhPos = [this.getCoords().toVector().x, this.getCoords().toVector().y] as [number, number];
        for(let i = 0; i < THRESHOLD; i++) {
            const theta = (360/THRESHOLD)*i;
            const pos = [Math.cos(theta),Math.sin(theta)] as [number, number];

            const bullet = new Bullet(this.#engine.getValidID(), null, bhPos, pos);
            this.#engine.addBullet(bullet);
        }
    }

}
