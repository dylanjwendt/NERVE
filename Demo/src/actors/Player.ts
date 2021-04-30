import { Actor, Vec2 } from "nerve-engine";
const MAXHEALTH = 255;

export default class Player extends Actor {
    private maxSpeed;
    private health;
    private defaultTint;

    constructor(id: string, name = "") {
        super(id, name);
        this.maxSpeed = 300;
        this.setScale([1.5, 1.5]);
        this.setWidth(48);
        this.setHeight(48);
        this.health = MAXHEALTH;
        this.defaultTint = this.getTint();
    }

    getHealth () {
        return this.health;
    }

    decHealth (dmg: number) {
        this.health -= dmg;
        if (this.health <= 0) {
            this.health = MAXHEALTH;
        }

        let tint = this.defaultTint;
        const ratio = ((MAXHEALTH - this.health)/MAXHEALTH);
        tint += 0xFF0000 * ratio;
        tint -= this.defaultTint * ratio;
        this.setTint(tint);
    }

    updateDirection(direction: string): void {
        // Note up/down directions are flipped for top-left origin
        if(direction === "down") {
            this.setVelocity(new Vec2(this.getVelocity().x, this.getVelocity().y + this.maxSpeed));
        }
        else if(direction === "up") {
            this.setVelocity(new Vec2(this.getVelocity().x, this.getVelocity().y - this.maxSpeed));
        }
        else if(direction === "left") {
            this.setVelocity(new Vec2(this.getVelocity().x - this.maxSpeed, this.getVelocity().y));
        }
        else if(direction === "right") {
            this.setVelocity(new Vec2(this.getVelocity().x + this.maxSpeed, this.getVelocity().y));
        }

        this.getVelocity().clamp(this.maxSpeed);
    }
}
