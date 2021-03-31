import * as postal from 'postal';
import ActorType from './actorType';
import EuclideanCoordinates, { Vec2 } from './coordinates';

export default class Actor {
    #type: ActorType;

    #name: string;

    #id: number;

    #coords: EuclideanCoordinates;

    #velocity: Vec2;

    #interactions: Array<ActorInteraction>;

    #triggerRadius: number;

    constructor(id: number, type: ActorType, name: string = '') {
      this.#type = type;
      this.#name = name;
      this.#coords = new EuclideanCoordinates();
      this.#velocity = new Vec2();
      this.#interactions = [];
      this.#id = id;
      this.#triggerRadius = 1;
    }

    setName(name: string) {
      this.#name = name;
    }

    getName(): string {
      return this.#name;
    }

    setCoords(coords: EuclideanCoordinates) {
      this.#coords = coords;
    }

    getCoords(): EuclideanCoordinates {
      return this.#coords;
    }

    setType(type: ActorType) {
      this.#type = type;
    }

    getType(): ActorType {
      return this.#type;
    }

    getID() {
      return this.#id;
    }

    setTriggerRadius(rad: number) {
      this.#triggerRadius = rad;
    }

    getTriggerRadius() {
      return this.#triggerRadius;
    }

    addInteraction(interaction: ActorInteraction) {
      this.#interactions.push(interaction);
    }

    checkInteraction(other: Actor, int: ActorInteraction) {
      if (other.getType() === int.getOtherType()) {
        int.trigger(this, other);
      }
    }

    checkInteractions(other: Actor) {
      this.#interactions.forEach((e) => this.checkInteraction(other, e));
    }

    moveTimestep(millisec: number) {
      const delta = millisec / 1000;
      const deltaPos = new Vec2(this.#velocity.x * delta, this.#velocity.y * delta);
      this.#coords.addVector(deltaPos);
    }

    setVelocity(vel: Vec2) {
      this.#velocity = vel;
    }

    addVelocity(vel: Vec2) {
      this.#velocity.add(vel);
    }

    getVelocity() {
      return this.#velocity;
    }
}

export class ActorInteraction {
  #otherType: ActorType;

  #channel = postal.channel();

  constructor(otherActorType: ActorType) {
    this.#otherType = otherActorType;
  }

  getOtherType() {
    return this.#otherType;
  }

  trigger(self: Actor, other: Actor) {
    this.#channel.publish('Actor.Interaction.Triggered', {
      ActorA_ID: self.getID(),
      ActorB_ID: other.getID(),
      Message: `${self.getName()} interacted with ${other.getName()}`,
    });
  }
}
