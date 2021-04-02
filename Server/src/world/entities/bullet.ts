import { IEntity } from "./entity.interface";
import * as crypto from "crypto";

const speed = 4;

export default class Bullet implements IEntity {
    id: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    scale: [number, number];
    tint: number;  // hexadecimal
    width: number;
    height: number;
    
    constructor(pos1: [number, number], pos2: [number, number]) {
        this.id = crypto.randomBytes(4).toString("hex");
        const normalization = Math.sqrt((pos1[0] - pos2[0]) ** 2 + (pos1[1] - pos2[1]) ** 2);
        this.vx = (pos2[0] - pos1[0]) / normalization;
        this.vy = (pos2[1] - pos1[1]) / normalization;
        this.vx *= speed;
        this.vy *= speed;
        this.scale = [0.5, 0.5];
        [this.x, this.y] = pos1;
        this.tint = 0xf5ef42;
        this.width = 16;
        this.height = 16;
    }
    
    update(): void {
        this.x += this.vx;
        this.y += this.vy;
    }
}
