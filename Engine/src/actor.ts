import { Bodies } from "matter-js";
import * as postal from "postal";
import { Engine } from ".";

export default class Actor {
    #name: string;
    #id: number;
    #interactions: ActorInteraction[];
    #scale: [number, number];
    #tint: number;
    #width: number;
    #height: number;
    public body: Matter.Body;
    public engine: Engine;

    constructor(id: number, name = "", body: Matter.Body, eng: Engine) { 
        this.#name = name;
        this.#interactions = [];
        this.#id = id;
        this.#scale = [1, 1];
        this.#tint = 0x00efff;
        this.#width = 16;
        this.#height = 16;
        //Default as circle at x = 0, y = 0, radius 5.
        if(!body) {
            body = Bodies.circle(0, 0, 5, {id: this.#id});
        }
        this.body = body;
        this.body.id = +id;
        this.engine = eng;
    }

    destroy(): void {
        this.engine.removeActor(this.#id);
    }

    setName(name: string): void {
        this.#name = name;
    }

    getName(): string {
        return this.#name;
    }

    getID(): number {
        return this.#id;
    }

    addInteraction(interaction: ActorInteraction): void {
        this.#interactions.push(interaction);
    }

    triggerInteractions(other: Actor, type: string): void {
        for(let i = 0; i < this.#interactions.length; i++) {
            this.#interactions[i].trigger(this, other, type);
        }
    }

    setScale(val: [number, number]): void
    {
        this.#scale = val;
    }

    getScale(): [number, number] {
        return this.#scale;  
    }

    setTint(val: number): void {
        this.#tint = val;
    }

    getTint(): number {
        return this.#tint;
    }

    setWidth(val: number): void {
        this.#width = val;
    }

    getWidth(): number {
        return this.#width;
    }

    setHeight(val: number): void {
        this.#height = val;
    }

    getHeight(): number {
        return this.#height;
    }
}

export abstract class ActorInteraction {
    //#otherType: typeof Actor;
  
    constructor() {
        //this.#otherType = Actor;
    }
  
    abstract trigger(self: Actor, other: Actor, type: string): void;
}
  
export class DefaultInteraction extends ActorInteraction {
    #channel = postal.channel();
    
    trigger(self: Actor, other: Actor, type: string): void {
        this.#channel.publish("Actor.Interaction.Triggered", {
            ActorA_ID: self.getID(),
            ActorB_ID: other.getID(),
            Type: type,
            Message: `${self.getName()} interacted with ${other.getName()}`,
        });
    }
}