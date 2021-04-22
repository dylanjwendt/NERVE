import * as postal from "postal";
import EuclideanCoordinates, { Vec2 } from "./coordinates";

export default class Actor {
    #name: string;
    #id: string;
    #coords: EuclideanCoordinates;
    #velocity: Vec2;
    #interactions: ActorInteraction[];
    #triggerRadius: number;
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
        this.#triggerRadius = 1;
        this.#scale = [0.5, 0.5];
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

    setTriggerRadius(rad: number): void {
        this.#triggerRadius = rad;
    }

    getTriggerRadius(): number {
        return this.#triggerRadius;
    }

    addInteraction(interaction: ActorInteraction): void {
        this.#interactions.push(interaction);
    }

    checkInteraction(other: Actor, int: ActorInteraction): void {
        if (other instanceof int.getOtherType())
        {
            int.trigger(this, other);
        }
    }

    checkInteractions(other: Actor, dist: number): void {
        this.#interactions.forEach((e) => {
            if(dist <= e.getTriggerDist())
            {
                this.checkInteraction(other, e);
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
  #otherType: typeof Actor;
  #triggerDist: number;
  #channel = postal.channel();

  constructor() {
      this.#otherType = Actor;
      this.#triggerDist = 1;
  }

  getOtherType() {
      return this.#otherType;
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
