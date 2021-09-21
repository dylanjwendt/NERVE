import { Body, Bodies, Vector, Events, Composite } from "matter-js";
import { Actor, ActorInteraction } from "nerve-engine";
import Bullet from "../actors/Bullet";
import { DemoEngine } from "..";

export class Attract extends ActorInteraction {

    forceStrength: number;

    constructor(parent: Actor, strength: number, body: Body) {
        super();
        this.forceStrength = strength;
    }

    trigger(self: Actor, other: Actor, type: string): void {
        console.log("woo");
        if(other instanceof Bullet && !((other as Bullet).isNullParent())) {
            const dx = (self.body.position.x - other.body.position.x);
            const dy = (self.body.position.y - other.body.position.y);
            const vec = {x: dx, y: dy};
            const dist = Vector.magnitude(vec);
            const norm = Vector.normalise(vec);
            const force = Vector.mult(norm, this.forceStrength/(dist*dist));
            console.log(force);
            console.log(self.body.id + " " + self.body.parent.id);
            console.log(self.body.position.x + " " + self.body.parent.position.x);
            console.log(self.body.position.y + " " + self.body.parent.position.y);
            Body.applyForce(other.body, other.body.position, force);
        }
    }
}

export default class Attractor extends Actor {  
    private parent: Actor;

    constructor(id: number, name = "", eng: DemoEngine, parent: Actor, radius = 100, strength = 10) {
        super(id, name, Bodies.circle(parent.body.position.x, parent.body.position.y, radius, {isSensor: false}), eng);
        this.setScale([2, 2]);
        this.setWidth(70);
        this.setHeight(70);
        //Body.setParts(parent.body, parent.body.parts.concat(this.body));
        //console.log(parent.body.parts);
        this.body.collisionFilter.mask = ~0b0;
        this.body.collisionFilter.category = 0;
        this.addInteraction(new Attract(this, strength, this.body));
        this.engine.gameLogic.addActor(this.body.id, this);
        Composite.add(this.engine.engine.world, this.body);
        this.parent = parent;
        Events.on(this.engine.engine, "afterUpdate", () => this.attach(this));
    }

    attach(attr: Attractor): void {
        Body.setPosition(attr.body, attr.parent.body.position);
    }
}