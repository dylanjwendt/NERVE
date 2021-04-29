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

  testInteraction(ActorA_id: string, ActorB_id: string, dist: number): void {
      if (this.actors.has(ActorA_id) && this.actors.has(ActorB_id)) {
          this.actors.get(ActorA_id)?.checkInteractions(this.actors.get(ActorB_id)!, dist);
      }
  }

  activate(): void {
      if (this.getStatus() !== "Online") {
          this.newSubscription(this.channel.subscribe({
              topic: "Actor.Interaction.Possible",
              callback: (data: any) => {
                  this.testInteraction(data.ActorA_ID, data.ActorB_ID, data.Dist);
              },
          }));
          this.newSubscription(this.channel.subscribe({
              topic: "Actor.Delete",
              callback: (data: any) => {
                  this.removeActor(data.ActorID);
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
