import Matter from "matter-js";
import { Actor } from "nerve-engine";
const MAXHEALTH = 255;

export default class Player extends Actor {
    private maxSpeed;
    private health;
    private defaultTint;

    constructor(id: string, name = "") {
        super(id, name, Matter.Bodies.circle(0,0,48));
        this.maxSpeed = 300;
        this.setScale([1.5, 1.5]);
        this.setWidth(48);
        this.setHeight(48);
        this.health = MAXHEALTH;
        this.defaultTint = this.getTint();
        Matter.Body.setStatic(this.body, true);
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
            this.body.position.y += this.maxSpeed;
        }
        else if(direction === "up") {
            this.body.position.y -= this.maxSpeed;
        }
        else if(direction === "left") {
            this.body.position.x -= this.maxSpeed;
        }
        else if(direction === "right") {
            this.body.position.x += this.maxSpeed;
        }

        this.clamp(this.body.velocity.x, this.maxSpeed);
        this.clamp(this.body.velocity.y, this.maxSpeed);
    }

    clamp(vel: number, maxSpeed: number):void {
        if (vel < 0) {
            if(vel < maxSpeed) vel = -maxSpeed;
        }
        if(vel > maxSpeed) vel = maxSpeed;
    }
}
