import * as postal from "postal";
import System from "./system";
import EuclideanCoordinates, { Vec2 } from "./coordinates";
import GameLogic from "./game-logic";
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

    addActorVel(id: string, vel: Vec2): void {
        this.#gameLogic.actors.get(id)?.addVelocity(vel);
    }

    setActorVel(id: string, vel: Vec2): void {
        this.#gameLogic.actors.get(id)?.setVelocity(vel);
    }

    addActorPos(id: string, pos: Vec2): void {
        const curCoords = this.#gameLogic.actors.get(id)?.getCoords();
        curCoords?.addVector(pos);
        this.#gameLogic.actors.get(id)?.setCoords(curCoords!);
    }

    setActorPos(id: string, pos: Vec2): void {
        this.#gameLogic.actors.get(id)?.setCoords(new EuclideanCoordinates(pos.x, pos.y));
    }

    moveTimestep(millisec: number): void {
        this.#gameLogic.actors.forEach((actor) => {
            actor.moveTimestep(millisec);
            if(actor.getCoords().getDistanceFromOrigin() > 4000) {
                this.#gameLogic.removeActor(actor.getID());
            }
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
                if (dist > 300) return;
                this.#channel.publish("Actor.Interaction.Possible", {
                    ActorA_ID: actor.getID(),
                    ActorB_ID: target.getID(),
                    Dist: dist,
                });
            }
        });
    }

    getActorById(id: string): Actor | undefined {
        return this.#gameLogic.actors.get(id);
    }
}
