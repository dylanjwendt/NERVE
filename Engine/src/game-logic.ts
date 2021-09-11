import System from "./system";
import Actor from "./actor";
import * as crypto from "crypto";
import { Engine } from ".";
import Matter from "matter-js";

export default class GameLogic extends System {
  public actors: Map<number, Actor>;
  private engine: Engine;

  constructor(engine: Engine) {
      super();
      this.sysName = "GameLogic";
      this.actors = new Map<number, Actor>();
      this.engine = engine;
  }

  addActor(id: number, actor: Actor): void {
      if(!this.actors.has(id)) {
          this.actors.set(id, actor);
          this.engine.addBody(actor.body);
      }
  }

  removeActor(id: number): void {
      if(this.actors.has(id)) {
          this.engine.removeBody(this.actors.get(id)!.body);
          this.actors.delete(id);
      }
  }

  public getValidId(): number {
      return Matter.Common.nextId();
  }
}
