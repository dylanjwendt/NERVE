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
    public gameData: any;

    /**
     * 
     * @param id Numeric ID Value of Actor. Only use the getValidID() function of engine to get values for this.
     * @param name Name of Actor to Display
     * @param body Matter.JS body to use in physics
     * @param eng Reference to Engine
     */
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

    /**
     * Remove this actor from the engine
     */
    destroy(): void {
        this.engine.removeActor(this.#id);
    }

    /**
     * Sets the name of player
     * @param name New name of player
     */
    setName(name: string): void {
        this.#name = name;
    }

    /**
     * 
     * @returns Name of player
     */
    getName(): string {
        return this.#name;
    }

    /**
     * 
     * @returns ID of player
     */
    getID(): number {
        return this.#id;
    }

    /**
     * Adds an interaction to actor's list of triggerable actions.
     * @param interaction New Interaction to add to object
     */
    addInteraction(interaction: ActorInteraction): void {
        this.#interactions.push(interaction);
    }

    /**
     * Handles collision triggering for interactions.
     * @param other Triggering actor
     * @param type Type of trigger
     */
    triggerInteractions(other: Actor, type: string): void {
        for(let i = 0; i < this.#interactions.length; i++) {
            this.#interactions[i].trigger(this, other, type);
        }
    }

    /**
     * 
     * @param val 2d Numeric scale of object
     */
    setScale(val: [number, number]): void
    {
        this.#scale = val;
    }

    /**
     * 
     * @returns 2d Numeric scale of object
     */
    getScale(): [number, number] {
        return this.#scale;  
    }

    /**
     * 
     * @param val hex tint of object to display
     */
    setTint(val: number): void {
        this.#tint = val;
    }

    /**
     * 
     * @returns hex tint of object to display
     */
    getTint(): number {
        return this.#tint;
    }

    /**
     * 
     * @param val New width of object
     */
    setWidth(val: number): void {
        this.#width = val;
    }

    /**
     * 
     * @returns Current width of object
     */
    getWidth(): number {
        return this.#width;
    }

    /**
     * 
     * @param val New height of object
     */
    setHeight(val: number): void {
        this.#height = val;
    }

    /**
     * 
     * @returns Current Height of object
     */
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
    
    /**
     * 
     * @param self Parent of Interaction
     * @param other Other Actor which Caused Trigger
     * @param type Type of Interaction 'Start', 'Active', or 'End'
     */
    trigger(self: Actor, other: Actor, type: string): void {
        this.#channel.publish("Actor.Interaction.Triggered", {
            ActorA_ID: self.getID(),
            ActorB_ID: other.getID(),
            Type: type,
            Message: `${self.getName()} interacted with ${other.getName()}`,
        });
    }
}