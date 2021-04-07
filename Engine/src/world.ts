import * as postal from "postal";
import System from "./system";
import EuclideanCoordinates, { Vec2 } from "./coordinates";
import GameLogic from "./gameLogic";

export default class World extends System {
    #channel: IChannelDefinition<any>;
    #gameLogic: GameLogic;

    constructor(gl: GameLogic) {
        super();
        this.sysName = "World";
        this.#channel = postal.channel();
        this.#gameLogic = gl;
    }

    addActorVel(id: number, vel: Vec2) {
        this.#gameLogic.actors[id].addVelocity(vel);
    }

    setActorVel(id: number, vel: Vec2) {
        this.#gameLogic.actors[id].setVelocity(vel);
    }

    addActorPos(id: number, pos: Vec2) {
        const curCoords = this.#gameLogic.actors[id].getCoords();
        curCoords.addVector(pos);
        this.#gameLogic.actors[id].setCoords(curCoords);
    }

    setActorPos(id: number, pos: Vec2) {
        this.#gameLogic.actors[id].setCoords(new EuclideanCoordinates(pos.x, pos.y));
    }

    moveTimestep(millisec: number) {
        for (let i = 0; i < this.#gameLogic.actors.length; i += 1) {
            this.#gameLogic.actors[i].moveTimestep(millisec);
        }
        for (let i = 0; i < this.#gameLogic.actors.length; i += 1) {
            this.checkActorProximityTrigger(i);
        }
    }

    checkActorProximityTrigger(id: number) {
        const curActor = this.#gameLogic.actors[id];
        for (let i = 0; i < this.#gameLogic.actors.length; i += 1) {
            if (i !== id) {
                const dist = curActor.getCoords().getDistanceTo(this.#gameLogic.actors[i].getCoords());
                if (dist <= curActor.getTriggerRadius()) {
                    this.#channel.publish("Actor.Interaction.Possible", {
                        ActorA_ID: id,
                        ActorB_ID: i,
                    });
                }
            }
        }
    }
}
