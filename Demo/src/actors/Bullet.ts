import { Actor, Engine, GameLogic} from "nerve-engine";
import Damage from "../interactions/Damage";
import Player from "./Player";
import { Body, Vector, Bodies, Events } from "matter-js";

const speed = 5;

export default class Bullet extends Actor {
    #parent: Player | null;
    private creationTime: number;
    private logic: GameLogic;
    private LIFETIME: number;


    constructor(id: number, parent: Player | null, pos1: [number, number], pos2: [number, number], engine: Matter.Engine, logic: GameLogic, eng: Engine, life = 3000) {
        super(id, "Bullet", Bodies.circle(0,0,8), eng);
        this.#parent = parent;
        const normalization = Math.sqrt((pos1[0] - pos2[0]) ** 2 + (pos1[1] - pos2[1]) ** 2);
        const offset = 35;
        const dx = ((pos2[0] - pos1[0]) / normalization);
        const dy = ((pos2[1] - pos1[1]) / normalization);
        const vx = dx * speed;
        const vy = dy * speed;
        Body.setVelocity(this.body, Vector.create(vx, vy));
        this.setScale([0.5, 0.5]);
        this.setTint(0xf5ef42);
        Body.setPosition(this.body, Vector.create(pos1[0]+offset*dx, pos1[1]+offset*dy));
        this.setWidth(16);
        this.setHeight(16);
        this.addInteraction(new Damage(this.#parent));
        this.body.collisionFilter.mask = 0b1100; 
        this.body.collisionFilter.category = 0b1<<3;
        this.body.frictionAir = 0;
        this.creationTime = engine.timing.timestamp;
        this.logic = logic;
        this.LIFETIME = life;
        this.addInteraction(new Damage(parent));
        this.gameData = {
            parentId: parent?.getID(),
            isBullet: true
        };
        Events.on(engine, "afterUpdate", (e) => this.maintainSpeed(e, this));
    }

    maintainSpeed(event: Matter.IEventTimestamped<Matter.Engine>, bull: Bullet): void {
        const normalization = Math.sqrt(bull.body.velocity.x * bull.body.velocity.x + bull.body.velocity.y * bull.body.velocity.y);
        const vx = (bull.body.velocity.x / normalization) * speed;
        const vy = (bull.body.velocity.y / normalization) * speed;
        Body.setVelocity(bull.body, Vector.create(vx, vy));
        if(this.engine.engine.timing.timestamp - bull.creationTime > bull.LIFETIME) {
            bull.destroy();
        }
    }  

    isNullParent(): boolean {
        return this.#parent === null;
    }
}
