import clamp from "../utils/clamp";
import sign from "../utils/sign";
import { IEntity } from "./entity.interface";
import * as crypto from "crypto";

const maxSpeed = 4;
const acceleration = 0.2;
const deceleration = 0.04;

export interface DirectionsHeld {
    up?: boolean,
    left?: boolean,
    down?: boolean,
    right?: boolean,
}

export default class Player implements IEntity {
    id: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    tint: number;  // hexadecimal
    scale: [number, number];
    directionsHeld = {
        up: false,
        left: false,
        down: false,
        right: false,
    };

    width: number;
    height: number;
    
    constructor(id: string) {
        this.id = id;
        const radius = 16;
        this.vx = 0;
        this.vy = 0;
        this.x = 128 - radius / 2;
        this.y = 128 - radius / 2;
        this.scale = [1.5, 1.5];
        this.tint = 0xff4d4d;
        this.width = 48;
        this.height = 48;
    }
    
    update(): void {
        this.x += this.vx;
        this.y -= this.vy; // origin in top left
        
        if (!this.directionsHeld.up && !this.directionsHeld.down) {
            this.vy += -deceleration * sign(this.vy);
        }
        if (!this.directionsHeld.left && !this.directionsHeld.right) {
            this.vx += -deceleration * sign(this.vx);
        }
        if (this.directionsHeld.up) {
            this.vy = clamp(this.vy + acceleration, -maxSpeed, maxSpeed);
        }
        if (this.directionsHeld.left) {
            this.vx = clamp(this.vx - acceleration, -maxSpeed, maxSpeed);
        }
        if (this.directionsHeld.down) {
            this.vy = clamp(this.vy - acceleration, -maxSpeed, maxSpeed);
        }
        if (this.directionsHeld.right) {
            this.vx = clamp(this.vx + acceleration, -maxSpeed, maxSpeed);
        }
    }
    
    updateDirection(directions: DirectionsHeld): void {
        Object.assign(this.directionsHeld, directions);
    }
}
