import { Actor, Vec2, EuclideanCoordinates } from "nerve-engine";
import Bounce from "../interactions/bounce";
import Damage from "../interactions/Damage";
import Player from "./Player";

const speed = 400;

export default class Bullet extends Actor {
    #parent: Player | null;

    constructor(id: string, parent: Player | null, pos1: [number, number], pos2: [number, number]) {
        super(id);
        this.#parent = parent;
        const normalization = Math.sqrt((pos1[0] - pos2[0]) ** 2 + (pos1[1] - pos2[1]) ** 2);
        const vx = ((pos2[0] - pos1[0]) / normalization) * speed;
        const vy = ((pos2[1] - pos1[1]) / normalization) * speed;
        this.setVelocity(new Vec2(vx, vy));
        this.setScale([0.5, 0.5]);
        this.setTint(0xf5ef42);
        this.setCoords(new EuclideanCoordinates(pos1[0], pos1[1]));
        this.setWidth(16);
        this.setHeight(16);

        this.addInteraction(new Bounce(this.#parent));
        this.addInteraction(new Damage(this.#parent));
    }

    isNullParent(): boolean {
        return this.#parent === null;
    }
}
