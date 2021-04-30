import { Actor, ActorInteraction } from "nerve-engine";
import Bullet from "../actors/Bullet";

export default class Attract extends ActorInteraction {
    constructor() {
        super();
        this.triggerDist = 250;
    }

    trigger(self: Actor, other: Actor): void {
        if(other instanceof Bullet && !other.isNullParent()) {
            //const speed = self.getVelocity().magnitude();
            const delta = self.getCoords()
                .getVectorTo(other.getCoords())
                .normalize()
                .mul(50);
            other.addVelocity(delta);
        }
    }
}
