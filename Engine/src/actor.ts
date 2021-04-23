import * as postal from "postal";
import EuclideanCoordinates, { Vec2 } from "./coordinates";

export default class Actor {
    #name: string;
    #id: string;
    #coords: EuclideanCoordinates;
    #velocity: Vec2;
    #interactions: ActorInteraction[];
    #scale: [number, number];
    #tint: number;
    #width: number;
    #height: number;

    constructor(id: string, name = "") {
        this.#name = name;
        this.#coords = new EuclideanCoordinates();
        this.#velocity = new Vec2();
        this.#interactions = [];
        this.#id = id;
        this.#scale = [1, 1];
        this.#tint = 0x00efff;
        this.#width = 16;
        this.#height = 16;
    }

    setName(name: string): void {
        this.#name = name;
    }

    getName(): string {
        return this.#name;
    }

    setCoords(coords: EuclideanCoordinates): void {
        this.#coords = coords;
    }

    getCoords(): EuclideanCoordinates {
        return this.#coords;
    }

    getID(): string {
        return this.#id;
    }

    addInteraction(interaction: ActorInteraction): void {
        this.#interactions.push(interaction);
    }

    checkInteractions(other: Actor, dist: number): void {
        this.#interactions.forEach((e) => {
            if(dist <= e.getTriggerDist())
            {
                e.trigger(this, other);
            }
        });
    }

    moveTimestep(millisec: number): void {
        const delta = millisec / 1000;
        const deltaPos = new Vec2(this.#velocity.x * delta, this.#velocity.y * delta);
        this.#coords.addVector(deltaPos);
    }

    setVelocity(vel: Vec2): void {
        this.#velocity = vel;
    }

    addVelocity(vel: Vec2): void {
        this.#velocity.add(vel);
    }

    getVelocity(): Vec2 {
        return this.#velocity;
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

export class ActorInteraction {
  //#otherType: typeof Actor;
  #channel = postal.channel();
  #triggerDist: number;

  constructor() {
      //this.#otherType = Actor;
      this.#triggerDist = 40;
  }

  getTriggerDist(): number {
      return this.#triggerDist;
  }

  trigger(self: Actor, other: Actor): void {
      this.#channel.publish("Actor.Interaction.Triggered", {
          ActorA_ID: self.getID(),
          ActorB_ID: other.getID(),
          Distance: self.getCoords().getDistanceTo(other.getCoords()),
          Message: `${self.getName()} interacted with ${other.getName()}`,
      });
  }
}
