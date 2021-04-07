import Actor, { ActorInteraction } from "./actor";
import ActorType from "./actorType";
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

const actor: Actor = engine.newActor(ActorType.default, "Actor A");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const actorB: Actor = engine.newActor(ActorType.default, "Actor B");

actor.addInteraction(new ActorInteraction(ActorType.default));

engine.setActorPos(0, new Vec2(-1, 0));
engine.setActorPos(1, new Vec2(1, 0));
engine.setActorVel(0, new Vec2(1, 0));
engine.setActorVel(1, new Vec2(-1, 0));

for (let i = 100; i <= 2000; i += 100) {
    setTimeout(() => {
        engine.update(100);
        console.log(engine.getWorldState());
    }, i * 10);
}
