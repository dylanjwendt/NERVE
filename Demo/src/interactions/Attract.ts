import { Actor, ActorInteraction } from "nerve-engine";
import Bullet from "../actors/Bullet";
import {Events, Body, Bodies, Vector, Composite} from "matter-js";

export default class Attractor extends ActorInteraction {
    force: number
    constructor(parent: Actor, radius = 150, force = 10) {
        super();
        this.force=force;
        const pid = parent.body.id;
        const b = Bodies.circle(0, 0, radius, {isSensor: true, label: pid.toString()});
        Composite.add(parent.engine.engine.world, b);
        function attract() {
            Body.setPosition(b, parent.body.position);
            parent.engine.gameLogic.actors.forEach((value: Actor, key: number) => {
                const tgt = value;
                if(tgt instanceof Bullet) {
                    const dist = Vector.magnitude(Vector.sub(tgt.body.position, b.position));
                    if(dist < radius) {
                        //This line error
                        //Body.applyForce(tgt.body, tgt.body.position, Vector.mult(Vector.sub(tgt.body.position, b.position),force));
                        const delta = Vector.mult(Vector.sub(b.position, tgt.body.position),force);
                        let v = Vector.add(Vector.mult(tgt.body.velocity,0.9995), Vector.mult(delta,0.0005));
                        v = Vector.mult(v, tgt.speed/Vector.magnitude(v));
                        Body.setVelocity(tgt.body, v);
                    }
                }
            });
        }
        Events.on(parent.engine.engine, "beforeUpdate", (e) => attract());
    }

    /**
     * 
     * @param self Reference to Impact's owner
     * @param other Reference to Other actor which has triggered interaction
     * @param type Type of interaction (Start, Active, or End)
     */
    trigger(self: Actor, other: Actor, type: string): void {
        if(other instanceof Bullet && !other.isNullParent()) {
            Body.applyForce(other.body, other.body.position, Vector.mult(Vector.sub(self.body.position, other.body.position),this.force));
        }
    }
}
