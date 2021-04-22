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

  addNewActor(id: string, actor: Actor): void {
      if(!this.actors.has(id)) {
          this.actors.set(id, actor);
      }
  }

  testInteraction(ActorA_id: string, ActorB_id: string, dist: number): void {
      if (this.actors.has(ActorA_id) && this.actors.has(ActorB_id)) {
          this.actors.get(ActorA_id)?.checkInteractions(this.actors.get(ActorB_id) as Actor, dist);
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
