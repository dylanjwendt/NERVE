import { Bodies, Body, Vector } from "matter-js";
import { Actor, Engine } from "nerve-engine";
const MAXHEALTH = 255;

export default class Player extends Actor {
    private health: number;
    private defaultTint: number;
    private classValue: number;
    protected maxSpeed: number;
    protected movemask: number;
    public gameData: PlayerState;

    constructor(id: number, eng: Engine, name = "") {
        super(id, name, Bodies.circle(0,0,24), eng);
        this.maxSpeed = 3;
        this.setScale([1.5, 1.5]);
        this.setWidth(48);
        this.setHeight(48);
        this.health = MAXHEALTH;
        this.classValue = 0;
        this.defaultTint = this.getTint();
        this.body.collisionFilter.mask = 0b1<<3; 
        this.body.collisionFilter.category = 0b1<<3;
        this.body.frictionAir = 0.01;
        this.movemask = 0b0000;
        Body.setMass(this.body, 100000);
        this.gameData = {
            hp: this.health,
            isAlive: true,
            name: name
        };
    }

    respawn(): void {
        this.health = MAXHEALTH;
        this.body.position = {x: 100, y: 100};
        this.body.collisionFilter.mask = 0b1<<3; 
    }

    setName(name: string): void {
        this.gameData.name = name;
        super.setName(name);
    }

    //Changes the class of the player allowing for unique play.
    changeClass(classValue : number): void {
        this.classValue = classValue;

        switch (this.classValue) {
        case 0:
            this.maxSpeed = 4;
            break;
        case 1:
            this.maxSpeed = 2;
            break;
        case 2:
            this.maxSpeed = 1;
            break;
        default:
            this.maxSpeed = 3;
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
        if(key === "w") {
            this.movemask |= 0b1000;
        }
        else if(key === "-w") {
            this.movemask &= 0b0111;
        }
        else if(key === "a") {
            this.movemask |= 0b0100;
        }
        else if(key === "-a") {
            this.movemask &= 0b1011;
        }
        else if(key === "s") {
            this.movemask |= 0b0010;
        }
        else if(key === "-s") {
            this.movemask &= 0b1101;
        }
        else if(key === "d") {
            this.movemask |= 0b0001;
        }
        else if(key === "-d") {
            this.movemask &= 0b1110;
        }

        //Move
        let vy = 0;
        let vx = 0;
        if(this.movemask & 0b1000) vy -= 1;
        if(this.movemask & 0b0100) vx -= 1;
        if(this.movemask & 0b0010) vy += 1;
        if(this.movemask & 0b0001) vx += 1;

        // If player is not holding a key, apply friction
        this.body.frictionAir = (this.movemask === 0b0000) ? 0.05 : 0;

        Body.setVelocity(this.body, Vector.create(vx*this.maxSpeed, vy*this.maxSpeed));
    }

    kill(): void {
        this.body.position = {x: -5000, y: -5000};
        this.body.collisionFilter.mask = 0;
        this.gameData.isAlive = false;
    }
}

interface PlayerState {
    isAlive: boolean,
    hp: number,
    name: string
}
