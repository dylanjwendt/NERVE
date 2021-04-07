import Actor, { ActorInteraction } from "./actor";
import Engine from "./engine";
import { Vec2 } from "./coordinates";

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
engine.showData(true);

const actor: Actor = engine.newActor("Actor A");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const actorB: Actor = engine.newActor("Actor B");

actor.addInteraction(new ActorInteraction());

engine.setActorPos(actor.getID(), new Vec2(-1, 0));
engine.setActorPos(actorB.getID(), new Vec2(1, 0));
engine.setActorVel(actor.getID(), new Vec2(1, 0));
engine.setActorVel(actorB.getID(), new Vec2(-1, 0));

for (let i = 100; i <= 2000; i += 100) {
    setTimeout(() => {
        engine.update(100);
        console.log(engine.getWorldState());
    }, i * 10);
}
