import Actor, { ActorInteraction } from './actor';
import ActorType from './actorType';
import Engine from './engine';
import { Vec2 } from './coordinates';

/*
const channel = postal.channel();

const term: Terminal = new Terminal();

const gameLogic: GameLogic = new GameLogic();

term.activate();
gameLogic.activate();
term.showData(true);
channel.publish('Actor.Interaction.Possible', {
  ActorA_ID: actor.getID(),
  ActorB_ID: actorB.getID(),
});
term.throwError('Test Error');
channel.publish('Actor.Interaction.Possible', {
  ActorA_ID: actorB.getID(),
  ActorB_ID: actor.getID(),
});
term.throwError('Test Error');
channel.publish('Actor.Interaction.Possible', {
  ActorA_ID: actor.getID(),
  ActorB_ID: actorB.getID(),
});
term.showData(false);
term.throwError('Test Error');
gameLogic.deactivate();
term.deactivate()
*/

const engine = new Engine();
// engine.showData(true);

const actor: Actor = Engine.newActor(ActorType.default, 'Actor A');

const actorB: Actor = Engine.newActor(ActorType.default, 'Actor B');

actor.addInteraction(new ActorInteraction(ActorType.default));

Engine.setActorPos(0, new Vec2(-1, 0));
Engine.setActorPos(1, new Vec2(1, 0));
Engine.setActorVel(0, new Vec2(1, 0));
Engine.setActorVel(1, new Vec2(-1, 0));

for (let i = 100; i <= 2000; i += 100) {
  setTimeout(() => {
    engine.moveTimestep(100);
    console.log(Engine.getWorldState());
  }, i * 10);
}
