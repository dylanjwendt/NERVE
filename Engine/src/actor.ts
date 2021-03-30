import * as postal from 'postal';
import ActorType from './actorType';
import Coordinates from './coordinates';

export default class Actor {
    #type: ActorType;

    #name: string;

    #id: number;

    #coords: Coordinates;

    #interactions: Array<ActorInteraction>;

    constructor(id: number, type: ActorType, name: string = '') {
      this.#type = type;
      this.#name = name;
      this.#coords = new Coordinates();
      this.#interactions = [];
      this.#id = id;
    }

    setName(name: string) {
      this.#name = name;
    }

    getName() {
      return this.#name;
    }

    setCoords(coords: Coordinates) {
      this.#coords = coords;
    }

    getCoords() {
      return this.#coords;
    }

    setType(type: ActorType) {
      this.#type = type;
    }

    getType() {
      return this.#type;
    }

    getID() {
      return this.#id;
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
