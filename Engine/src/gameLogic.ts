import System from './system';
import Actor from './actor';
import ActorType from './actorType';

export default class GameLogic extends System {
  static actors: Array<Actor>;

  constructor() {
    super();
    this.sysName = 'GameLogic';
    GameLogic.actors = [];
  }

  static newActor(type: ActorType, name: string = '') {
    GameLogic.actors.push(new Actor(GameLogic.actors.length, type, name));
    return GameLogic.actors[GameLogic.actors.length - 1];
  }

  static testInteraction(ActorA_ID: number, ActorB_ID: number) {
    if (ActorA_ID < GameLogic.actors.length && ActorB_ID < GameLogic.actors.length) {
      GameLogic.actors[ActorA_ID].checkInteractions(GameLogic.actors[ActorB_ID]);
    }
  }

  activate() {
    if (this.getStatus() !== 'Online') {
      this.newSubscription(this.channel.subscribe({
        topic: 'Actor.Interaction.Possible',
        callback(data: any) {
          GameLogic.testInteraction(data.ActorA_ID, data.ActorB_ID);
        },
      }));
    }
    super.activate();
  }
}
