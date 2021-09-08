import System from "./system";
import Actor from "./actor";
import * as crypto from "crypto";

export default class GameLogic extends System {
  public actors: Map<string, Actor>;

  constructor() {
      super();
      this.sysName = "GameLogic";
      this.actors = new Map<string, Actor>();
  }

  addActor(id: string, actor: Actor): void {
      if(!this.actors.has(id)) {
          this.actors.set(id, actor);
      }
  }

  removeActor(id: string): void {
      if(this.actors.has(id)) {
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
