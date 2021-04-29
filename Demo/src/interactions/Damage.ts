import { Actor, ActorInteraction } from "nerve-engine";
import Player from "../actors/Player";

export default class Damage extends ActorInteraction {
    #parent: Player;
    constructor(parent: Player) {
        super();
        this.#parent = parent;
    }

    trigger(self: Actor, other: Actor): void {
        if(other instanceof Player && other.getID() !== this.#parent.getID()) {
            other.decHealth(10);
            this.#parent = other;
        }
    }
}