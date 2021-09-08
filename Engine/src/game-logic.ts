import System from "./system";
import Actor from "./actor";
import * as crypto from "crypto";
import { Engine } from ".";

export default class GameLogic extends System {
  public actors: Map<string, Actor>;
  private engine: Engine;

  constructor(engine: Engine) {
      super();
      this.sysName = "GameLogic";
      this.actors = new Map<string, Actor>();
      this.engine = engine;
  }

  addActor(id: string, actor: Actor): void {
      if(!this.actors.has(id)) {
          this.actors.set(id, actor);
          this.engine.addBody(actor.body);
          actor.body.id = +id;
      }
  }

  removeActor(id: string): void {
      if(this.actors.has(id)) {
          this.engine.removeBody(this.actors.get(id)!.body);
          this.actors.delete(id);
      }
  }

  public getValidID(): string {
      let id: string;
      id = crypto.randomInt(281474976710655).toString();
      while(this.actors.has(id))
      {
          id = crypto.randomInt(281474976710655).toString();
      }
      return id;
  }
}
