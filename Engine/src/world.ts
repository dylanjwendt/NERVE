import * as postal from "postal";
import System from "./system";
import EuclideanCoordinates, { Vec2 } from "./coordinates";
import GameLogic from "./gameLogic";
import Actor from "./actor";

export default class World extends System {
    #channel: IChannelDefinition<any>;
    #gameLogic: GameLogic;

    constructor(gl: GameLogic) {
        super();
        this.sysName = "World";
        this.#channel = postal.channel();
        this.#gameLogic = gl;
    }

    addActorVel(id: number, vel: Vec2): void {
        this.#gameLogic.actors.get(id)?.addVelocity(vel);
    }

    setActorVel(id: number, vel: Vec2): void {
        this.#gameLogic.actors.get(id)?.setVelocity(vel);
    }

    addActorPos(id: number, pos: Vec2): void {
        const curCoords = this.#gameLogic.actors.get(id)?.getCoords();
        curCoords?.addVector(pos);
        this.#gameLogic.actors.get(id)?.setCoords(curCoords!);
    }

    setActorPos(id: number, pos: Vec2): void {
        this.#gameLogic.actors.get(id)?.setCoords(new EuclideanCoordinates(pos.x, pos.y));
    }

    moveTimestep(millisec: number): void {
        this.#gameLogic.actors.forEach((actor) => {
            actor.moveTimestep(millisec);
        });
        this.#gameLogic.actors.forEach((actor) => {
            this.checkActorProximityTrigger(actor);
        });
        this.#gameLogic.actors.forEach((actor) => {
            actor.getVelocity().decel(new Vec2(1,1).mul(millisec/1000));
        });
    }

    checkActorProximityTrigger(actor: Actor): void {
        this.#gameLogic.actors.forEach((target) => {
            if(actor.getID() != target.getID()) {
                const dist = actor.getCoords().getDistanceTo(target.getCoords());
                this.#channel.publish("Actor.Interaction.Possible", {
                    ActorA_ID: actor.getID(),
                    ActorB_ID: target.getID(),
                    Dist: dist,
                });
            }
        });
    }

    getActorById(id: number): Actor | undefined {
        return this.#gameLogic.actors.get(id);
    }
}
