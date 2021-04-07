import { Vec2 } from "./coordinates";
import ActorType from "./actorType";
import GameLogic from "./gameLogic";
import Terminal from "./terminal";
import World from "./world";

export default class Engine {
  #term: Terminal;

  #gameLogic: GameLogic;

  #world: World;

  constructor() {
      this.#term = new Terminal();
      this.#gameLogic = new GameLogic();
      this.#world = new World(this.#gameLogic);
      this.#term.activate();
      this.#gameLogic.activate();
      this.#world.activate();
  }

  getWorldState(): Array<Vec2> {
      const retArr = new Array<Vec2>();
      this.#gameLogic.actors.forEach((e) => retArr.push((e.getCoords().toVector())));
      return retArr;
  }

  addActorVel(id: number, vel: Vec2) {
      this.#world.addActorVel(id, vel);
  }

  setActorVel(id: number, vel: Vec2) {
      this.#world.setActorVel(id, vel);
  }

  addActorPos(id: number, vel: Vec2) {
      this.#world.addActorPos(id, vel);
  }

  setActorPos(id: number, vel: Vec2) {
      this.#world.setActorPos(id, vel);
  }

  newActor(type: ActorType, name = "") {
      return this.#gameLogic.newActor(type, name);
  }

  update(millisec: number) {
      this.#world.moveTimestep(millisec);
  }

  showData(show: boolean) {
      this.#term.showData(show);
  }
}
