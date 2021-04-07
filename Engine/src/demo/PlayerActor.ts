import Actor from "../actor";
import { Vec2 } from "../coordinates";

export default class PlayerActor extends Actor {
    private maxSpeed;

    constructor(id: number, name = "") {
        super(id, name);
        this.maxSpeed = 1;
    }

    updateDirection(direction: string): void {
        if(direction === "up") {
            this.setVelocity(new Vec2(this.getVelocity().x, this.getVelocity().y+this.maxSpeed));
        }
        else if(direction === "down") {
            this.setVelocity(new Vec2(this.getVelocity().x, this.getVelocity().y-this.maxSpeed));
        }
        else if(direction === "left") {
            this.setVelocity(new Vec2(this.getVelocity().x+this.maxSpeed, this.getVelocity().y));
        }
        else if(direction === "right") {
            this.setVelocity(new Vec2(this.getVelocity().x-this.maxSpeed, this.getVelocity().y));
        }
        this.getVelocity().clamp(this.maxSpeed);
    }
}