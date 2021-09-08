import Matter from "matter-js";
import { Actor } from "nerve-engine";
const MAXHEALTH = 255;

export default class Player extends Actor {
    private maxSpeed;
    private health;
    private defaultTint;

    constructor(id: string, name = "") {
        super(id, name, Matter.Bodies.circle(0,0,48));
        this.maxSpeed = 1;
        this.setScale([1.5, 1.5]);
        this.setWidth(48);
        this.setHeight(48);
        this.health = MAXHEALTH;
        this.defaultTint = this.getTint();
        this.body.collisionFilter.category = 0x100;
        this.body.collisionFilter.mask = ~0x100; 
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
            Matter.Body.setVelocity(this.body, Matter.Vector.create(this.body.velocity.x, - this.maxSpeed));
        }
        else if(direction === "up") {
            Matter.Body.setVelocity(this.body, Matter.Vector.create(this.body.velocity.x, + this.maxSpeed));
        }
        else if(direction === "left") {
            Matter.Body.setVelocity(this.body, Matter.Vector.create( - this.maxSpeed, this.body.velocity.y));
        }
        else if(direction === "right") {
            Matter.Body.setVelocity(this.body, Matter.Vector.create( + this.maxSpeed, this.body.velocity.y));
        }

        Matter.Body.setVelocity(this.body, Matter.Vector.create(this.clamp(this.body.velocity.x, this.maxSpeed), this.clamp(this.body.velocity.x, this.maxSpeed)));
    }

    clamp(vel: number, maxSpeed: number): number {
        if (vel < 0) {
            if(vel < maxSpeed) vel = -maxSpeed;
        }
        if(vel > maxSpeed) vel = maxSpeed;
        return vel;
    }
}
