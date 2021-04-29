import { Actor, ActorInteraction } from "nerve-engine";
import Blackhole from "../actors/Blackhole";
import Player from "../actors/Player";
import Bullet from "../actors/Bullet";

export default class Impact extends ActorInteraction {
    constructor() {
        super();
    }

    trigger(self: Actor, other: Actor): void {
        if(other instanceof Bullet && !other.isNullParent()) {
            (self as Blackhole).objectImpact(self);
        }
    }
}
