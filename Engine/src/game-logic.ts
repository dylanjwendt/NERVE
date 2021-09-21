import System from "./system";
import Actor from "./actor";
import { Engine } from ".";
import { Common } from "matter-js";

export default class GameLogic extends System {
  public actors: Map<number, Actor>;
  private engine: Engine;

  /**
   * 
   * @param engine Reference to parent Engine
   */
  constructor(engine: Engine) {
      super();
      this.sysName = "GameLogic";
      this.actors = new Map<number, Actor>();
      this.engine = engine;
  }

  /**
   * 
   * @param id Numberic ID of actor to add. Only use the getValidID() function of engine to get values for this.
   * @param actor Reference to Actor to add
   */
  addActor(id: number, actor: Actor): void {
      if(!this.actors.has(id)) {
          this.actors.set(id, actor);
          this.engine.addBody(actor.body);
      }
  }

  /**
   * 
   * @param id ID of actor to remove
   */
  removeActor(id: number): void {
      if(this.actors.has(id)) {
          this.engine.removeBody(this.actors.get(id)!.body);
          this.actors.delete(id);
      }
  }

  /**
   * 
   * @returns Valid Numeric ID that is safe to use in engine.
   */
  public getValidID(): number {
      return Common.nextId();
  }
}
