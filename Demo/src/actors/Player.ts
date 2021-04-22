import { Actor, Vec2 } from "nerve-engine";

export default class Player extends Actor {
    private maxSpeed;

    constructor(id: string, name = "") {
        super(id, name);
        this.maxSpeed = 300;
        this.setScale([1.5, 1.5]);
        this.setWidth(48);
        this.setHeight(48);
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
