import { Actor, ActorInteraction } from "nerve-engine";
import Player from "../actors/Player";

export default class Bounce extends ActorInteraction {
    #parent: Player;
    constructor(parent: Player) {
        super();
        this.#parent = parent;
    }

    trigger(self: Actor, other: Actor): void {
        if(other instanceof Player && other.getID() !== this.#parent.getID()) {
            const speed = self.getVelocity().magnitude();
            const delta = self.getCoords()
                .getVectorTo(other.getCoords())
                .normalize()
                .mul(speed);
            self.setVelocity(delta);
        }
    }
}
