import * as postal from 'postal';
import System from './system';
import EuclideanCoordinates, { Vec2 } from './coordinates';
import GameLogic from './gameLogic';

export default class World extends System {
    #channel: IChannelDefinition<any>;

    constructor() {
      super();
      this.sysName = 'World';
      this.#channel = postal.channel();
    }

    static addActorVel(id: number, vel: Vec2) {
      GameLogic.actors[id].addVelocity(vel);
    }

    static setActorVel(id: number, vel: Vec2) {
      GameLogic.actors[id].setVelocity(vel);
    }

    static addActorPos(id: number, pos: Vec2) {
      const curCoords = GameLogic.actors[id].getCoords();
      curCoords.addVector(pos);
      GameLogic.actors[id].setCoords(curCoords);
    }

    static setActorPos(id: number, pos: Vec2) {
      GameLogic.actors[id].setCoords(new EuclideanCoordinates(pos.x, pos.y));
    }

    moveTimestep(millisec: number) {
      for (let i = 0; i < GameLogic.actors.length; i += 1) {
        GameLogic.actors[i].moveTimestep(millisec);
      }
      for (let i = 0; i < GameLogic.actors.length; i += 1) {
        this.checkActorProximityTrigger(i);
      }
    }

    checkActorProximityTrigger(id: number) {
      const curActor = GameLogic.actors[id];
      for (let i = 0; i < GameLogic.actors.length; i += 1) {
        if (i !== id) {
          const dist = curActor.getCoords().getDistanceTo(GameLogic.actors[i].getCoords());
          if (dist <= curActor.getTriggerRadius()) {
            this.#channel.publish('Actor.Interaction.Possible', {
              ActorA_ID: id,
              ActorB_ID: i,
            });
          }
        }
      }
    }
}
