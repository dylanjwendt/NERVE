import { Vec2 } from './coordinates';
import ActorType from './actorType';
import GameLogic from './gameLogic';
import Terminal from './terminal';
import World from './world';

export default class Engine {
  #term: Terminal;

  #gameLogic: GameLogic;

  #world: World;

  constructor() {
    this.#term = new Terminal();
    this.#gameLogic = new GameLogic();
    this.#world = new World();
    this.#term.activate();
    this.#gameLogic.activate();
    this.#world.activate();
  }

  static getWorldState(): Array<Vec2> {
    const retArr = new Array<Vec2>();
    GameLogic.actors.forEach((e) => retArr.push((e.getCoords().toVector())));
    return retArr;
  }

  static addActorVel(id: number, vel: Vec2) {
    World.addActorVel(id, vel);
  }

  static setActorVel(id: number, vel: Vec2) {
    World.setActorVel(id, vel);
  }

  static addActorPos(id: number, vel: Vec2) {
    World.addActorPos(id, vel);
  }

  static setActorPos(id: number, vel: Vec2) {
    World.setActorPos(id, vel);
  }

  static newActor(type: ActorType, name: string = '') {
    return GameLogic.newActor(type, name);
  }

  moveTimestep(millisec: number) {
    this.#world.moveTimestep(millisec);
  }

  showData(show: boolean) {
    this.#term.showData(show);
  }
}
