import { Actor, ActorInteraction } from "nerve-engine";
import Blackhole from "../actors/Blackhole";
import Bullet from "../actors/Bullet";

export default class Impact extends ActorInteraction {
    /**
     * 
     * @param self Reference to Impact's owner
     * @param other Reference to Other actor which has triggered interaction
     * @param type Type of interaction (Start, Active, or End)
     */
    trigger(self: Actor, other: Actor, type: string): void {
        if(other instanceof Bullet && !other.isNullParent()) {
            (self as Blackhole).objectImpact(other);
        }
    }
}
