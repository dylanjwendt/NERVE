import { Actor, ActorInteraction } from "nerve-engine";
import Player from "../actors/Player";

export default class Damage extends ActorInteraction {
    #parent: Player | null;

    /**
     * 
     * @param parent Owner of bullet, or null if unowned
     */
    constructor(parent: Player | null) {
        super();
        this.#parent = parent;
    }

    /**
     * 
     * @param self Reference to Damage's owner
     * @param other Reference to Other actor which will be damaged
     * @param type Type of interaction (Start, Active, or End)
     */
    trigger(self: Actor, other: Actor, type: string): void {
        if(other instanceof Player && (this.#parent === null || other.getID() !== this.#parent.getID())) {
            other.decHealth(10);
            this.#parent = other;
        }
    }
}