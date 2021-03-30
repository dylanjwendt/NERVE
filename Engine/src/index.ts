import * as postal from 'postal';
import Actor, { ActorInteraction } from './actor';
import ActorType from './actorType';
import GameLogic from './gameLogic';
import Terminal from './terminal';

const channel = postal.channel();

const term: Terminal = new Terminal();

const gameLogic: GameLogic = new GameLogic();

const actor: Actor = GameLogic.newActor(ActorType.default, 'Actor A');

const actorB: Actor = GameLogic.newActor(ActorType.default, 'Actor B');

actor.addInteraction(new ActorInteraction(ActorType.default));

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
term.deactivate();
