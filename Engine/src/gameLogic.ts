import System from "./system";
import Actor from "./actor";
import ActorType from "./actorType";

export default class GameLogic extends System {
  public actors: Array<Actor>;

  constructor() {
      super();
      this.sysName = "GameLogic";
      this.actors = [];
  }

  newActor(type: ActorType, name = "") {
      this.actors.push(new Actor(this.actors.length, type, name));
      return this.actors[this.actors.length - 1];
  }

  testInteraction(ActorA_ID: number, ActorB_ID: number) {
      if (ActorA_ID < this.actors.length && ActorB_ID < this.actors.length) {
          this.actors[ActorA_ID].checkInteractions(this.actors[ActorB_ID]);
      }
  }

  activate() {
      if (this.getStatus() !== "Online") {
          this.newSubscription(this.channel.subscribe({
              topic: "Actor.Interaction.Possible",
              callback(data: any) {
                  this.testInteraction(data.ActorA_ID, data.ActorB_ID);
              },
          }));
      }
      super.activate();
  }
}
