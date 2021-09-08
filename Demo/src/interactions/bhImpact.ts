import { Actor, ActorInteraction } from "nerve-engine";
import Blackhole from "../actors/Blackhole";
import Bullet from "../actors/Bullet";

export default class Impact extends ActorInteraction {

    trigger(self: Actor, other: Actor): void {
        if(other instanceof Bullet && !other.isNullParent()) {
            (self as Blackhole).objectImpact(other);
        }
    }
}
