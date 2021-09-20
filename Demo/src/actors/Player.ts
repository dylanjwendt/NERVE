import Matter from "matter-js";
import { Actor, Engine } from "nerve-engine";
const MAXHEALTH = 255;

export default class Player extends Actor {
    private health;
    private defaultTint;
    private classValue;
    protected maxSpeed;
    protected movemask: number;

    constructor(id: number, eng: Engine, name = "") {
        super(id, name, Matter.Bodies.circle(0,0,24), eng);
        this.maxSpeed = 3;
        this.setScale([1.5, 1.5]);
        this.setWidth(48);
        this.setHeight(48);
        this.health = MAXHEALTH;
        this.classValue = 0;
        this.defaultTint = this.getTint();
        this.body.collisionFilter.mask = 0b1<<3; 
        this.body.collisionFilter.category = 0b1<<1;
        this.body.frictionAir = 0;
        this.movemask = 0b0000;
        Matter.Body.setMass(this.body, 100000);
    }

    //Changes the class of the player allowing for unique play.
    changeClass(classValue : number): void {
        this.classValue = classValue;
        //Revent to default values
        this.maxSpeed = 3;

        switch (this.classValue) {
        case 0:
            this.maxSpeed = 5;
            break;
        case 1:
            this.maxSpeed = 2;
            break;
        case 2:
            this.maxSpeed = 1;
            break;
        default:
            break;
        }
    }

    getClass(): number {
        return this.classValue;
    }

    getHealth(): number {
        return this.health;
    }

    decHealth(dmg: number): void {
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

    updateDirection(key: string): void {
        // Note up/down directions are flipped for top-left origin
        if(key == "w") {
            this.movemask |= 0b1000;
        }
        else if(key == "-w") {
            this.movemask &= 0b0111;
        }
        else if(key == "a") {
            this.movemask |= 0b0100;
        }
        else if(key == "-a") {
            this.movemask &= 0b1011;
        }
        else if(key == "s") {
            this.movemask |= 0b0010;
        }
        else if(key == "-s") {
            this.movemask &= 0b1101;
        }
        else if(key == "d") {
            this.movemask |= 0b0001;
        }
        else if(key == "-d") {
            this.movemask &= 0b1110;
        }

        //Move
        let vy = 0;
        let vx = 0;
        if(this.movemask & 0b1000) vy -= 1;
        if(this.movemask & 0b0100) vx -= 1;
        if(this.movemask & 0b0010) vy += 1;
        if(this.movemask & 0b0001) vx += 1;

        Matter.Body.setVelocity(this.body, Matter.Vector.create(vx*this.maxSpeed, vy*this.maxSpeed));
    }
}
