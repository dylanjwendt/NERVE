import { Actor, ActorInteraction } from "nerve-engine";
import Player from "../actors/Player";
import WallPiece from "../actors/WallPiece";

export default class Bounce extends ActorInteraction {
    #parent: Player | null;
    constructor(parent: Player | null) {
        super();
        this.#parent = parent;
    }

    trigger(self: Actor, other: Actor): void {
        const isValidTarget = other instanceof Player || other instanceof WallPiece;
        if(isValidTarget && (this.#parent === null || other.getID() !== this.#parent.getID())) {
            const speed = self.getVelocity().magnitude();
            const delta = self.getCoords()
                .getVectorTo(other.getCoords())
                .normalize()
                .mul(speed);
            self.setVelocity(delta);
            if(other instanceof Player) {
                this.#parent = other;
            }
        }
    }
}
