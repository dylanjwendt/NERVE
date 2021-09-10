import Matter from "matter-js";
import { Actor, ActorInteraction } from "nerve-engine";
import Player from "../actors/Player";

export default class Attract extends ActorInteraction {
    AttractForce: number;

    constructor(parent: Actor, radius: number) {
        super();
        this.AttractForce = 10;
        const sensor = Matter.Bodies.circle(parent.body.position.x, parent.body.position.y, radius, {isSensor: true});
        Matter.Composite.add(parent.engine.engine.world, sensor);
        const constraint = Matter.Constraint.create({
            bodyA: parent.body,
            bodyB: sensor,
            damping: 0.1
        });
        Matter.Composite.add(parent.engine.engine.world, constraint);
    }

    trigger(self: Actor, other: Actor, type: string): void {
        if(type == "Active") {
            const deltax = self.body.position.x - other.body.position.x;
            const deltay = self.body.position.y - other.body.position.y;
            const vec = Matter.Vector.create(deltax, deltay);
            const norm = Matter.Vector.normalise(vec);
            Matter.Body.applyForce(other.body, other.body.position, Matter.Vector.mult(norm, this.AttractForce));
        }
    }
}