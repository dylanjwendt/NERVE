import { Actor, ActorInteraction } from "nerve-engine";
import Player from "../actors/Player";

export default class Damage extends ActorInteraction {
    #parent: Player | null;
    constructor(parent: Player | null) {
        super();
        this.#parent = parent;
    }

    trigger(self: Actor, other: Actor, type: string): void {
        console.log("%s %s\n", self, other);
        if(other instanceof Player && (this.#parent === null || other.getId() !== this.#parent.getId())) {
            other.decHealth(10);
            this.#parent = other;
        }
    }
}