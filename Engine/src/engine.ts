import { Vec2 } from "./coordinates";
import Actor from "./actor";
import GameLogic from "./gameLogic";
import Terminal from "./terminal";
import World from "./world";
import {IEntity} from "../../Server/src/world/entities/entity.interface";
import InputHandler from "./inputHandler";

export default abstract class Engine {
  #term: Terminal;

  protected gameLogic: GameLogic;

  #world: World;

  #inputHandler: InputHandler;


  constructor(GetHandler: (a: World)=>InputHandler) {
      this.#term = new Terminal();
      this.gameLogic = new GameLogic();
      this.#world = new World(this.gameLogic);
      this.#inputHandler = GetHandler(this.#world);
      this.#term.activate();
      this.gameLogic.activate();
      this.#world.activate();
      this.#inputHandler.activate();
  }

  getWorldState(): Array<IEntity> {
      const retArr = new Array<IEntity>();
      //this.#gameLogic.actors.forEach((e) => retArr.push((e.getCoords().toVector())));
      this.gameLogic.actors.forEach((actor) => {
          retArr.push(new EntityEntry(actor));
      });
      return retArr;
  }

  addActorVel(id: number, vel: Vec2): void {
      this.#world.addActorVel(id, vel);
  }

  setActorVel(id: number, vel: Vec2): void {
      this.#world.setActorVel(id, vel);
  }

  addActorPos(id: number, vel: Vec2): void {
      this.#world.addActorPos(id, vel);
  }

  setActorPos(id: number, vel: Vec2): void {
      this.#world.setActorPos(id, vel);
  }

  addNewActor(id: number, actor: Actor): void  {
      return this.gameLogic.addNewActor(id, actor);
  }

  update(millisec: number): void {
      this.#world.moveTimestep(millisec);
  }

  showData(show: boolean): void {
      this.#term.showData(show);
  }

  abstract handleKeyInput(pid: number, key: string): void;

  abstract handleMouseDownInput(ActorID: number, pos: [number, number]): void;

  abstract handleMouseUpInput(ActorID: number, pos: [number, number]): void;

  abstract handleMouseMoveInput(ActorID: number, pos: [number, number]): void;
}

class EntityEntry implements IEntity {
    id: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    scale: [number, number];
    tint: number;
    width: number;
    height: number;
    update(): void {
        throw new Error("Method not implemented.");
    }

    constructor(actor: Actor){
        this.id = actor.getID().toString();
        this.x = actor.getCoords().toVector().x;
        this.y = actor.getCoords().toVector().y;
        this.vx = actor.getVelocity().x;
        this.vy = actor.getVelocity().y;
        this.scale = actor.getScale();
        this.tint = actor.getTint();
        this.width = actor.getWidth();
        this.height = actor.getHeight();
    }
}
