import System from "./system";
import Actor from "./actor";
import * as crypto from "crypto";

export default class GameLogic extends System {
  //public actors: Array<Actor>;
  public actors: Map<number, Actor>;

  constructor() {
      super();
      this.sysName = "GameLogic";
      this.actors = new Map<number, Actor>();
  }

  addNewActor(id: number, actor: Actor): void {
      if(!this.actors.has(id)) {
          this.actors.set(id, actor);
      }
  }

  testInteraction(ActorA_ID: number, ActorB_ID: number, dist: number): void {
      if (this.actors.has(ActorA_ID) && this.actors.has(ActorB_ID)) {
          this.actors.get(ActorA_ID)?.checkInteractions(this.actors.get(ActorB_ID) as Actor, dist);
      }
  }

  activate(): void {
      const callbackfunc = (data: any) => {
          this.testInteraction(data.ActorA_ID, data.ActorB_ID, data.Dist);
      };
      if (this.getStatus() !== "Online") {
          this.newSubscription(this.channel.subscribe({
              topic: "Actor.Interaction.Possible",
              callback(data: any) {
                  callbackfunc(data);
              },
          }));
      }
      super.activate();
  }

  public getValidID(): number {
      let id: number;
      id = crypto.randomInt(281474976710655);
      while(this.actors.has(id))
      {
          id = crypto.randomInt(281474976710655);
      }
      return id;
  }
}
