import { Actor, ActorInteraction } from "nerve-engine";
import Bullet from "../actors/Bullet";

export default class Attract extends ActorInteraction {
    constructor() {
        super();
        this.triggerDist = 125;
    }

    trigger(self: Actor, other: Actor): void {
        if(other instanceof Bullet && !other.isNullParent()) {
            const speed = self.getVelocity().magnitude();
            const delta = self.getCoords()
                .getVectorTo(other.getCoords())
                .normalize()
                .mul(0.1*speed);
            other.addVelocity(delta);
        }
    }
}
