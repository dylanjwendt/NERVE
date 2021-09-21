import Actor from "./actor";
import GameLogic from "./game-logic";
import Terminal from "./terminal";
import { IEntity } from "nerve-common";
import InputHandler from "./input-handler";
import { Engine as MatterEngine, Events, Composite, World }from "matter-js";

export default abstract class Engine {
    gameLogic: GameLogic;
    #term: Terminal;
    inputHandler: InputHandler;
    engine: Matter.Engine;

    constructor(getHandler: (l: GameLogic) => InputHandler) {
        this.#term = new Terminal();
        this.gameLogic = new GameLogic(this);
        this.inputHandler = getHandler(this.gameLogic);
        this.#term.activate();
        this.gameLogic.activate();
        this.inputHandler.activate();
        this.#term.deactivate();
        //Matter Integration
        this.engine = MatterEngine.create();
        this.engine.gravity.x = 0;
        this.engine.gravity.y = 0;
        function handleEvent(event: Matter.IEventCollision<Matter.Engine>, actors: Map<number, Actor>, type: string) {
            const pairs = event.pairs;
            for (let i = 0; i < pairs.length; i++) {
                const pair = pairs[i];
                const id1 = pair.bodyA.id;
                const id2 = pair.bodyB.id;
                if (pair.bodyA.isSensor || pair.bodyB.isSensor) {
                    console.log("Sensoring");
                }
                const actorA = actors.get(id1);
                const actorB = actors.get(id2);
                if(!actorA || !actorB) {
                    return;
                }
                actorA.triggerInteractions(actorB, type);
                actorB.triggerInteractions(actorA, type);
            }
        }
        Events.on(this.engine, "collisionStart", (e) => handleEvent(e, this.gameLogic.actors, "Start"));
        Events.on(this.engine, "collisionActive", (e) => handleEvent(e, this.gameLogic.actors, "Active"));
        Events.on(this.engine, "collisionEnd", (e) => handleEvent(e, this.gameLogic.actors, "End"));
    }

    getWorldState(): IEntity[] {
        const retArr: IEntity[] = [];
        this.gameLogic.actors.forEach((actor) => {
            retArr.push(new EntityEntry(actor));
        });
        return retArr;
    }

    addActor(id: number, actor: Actor): void  {
        this.gameLogic.addActor(id, actor);
        Composite.add(this.engine.world, actor.body);
    }

    removeActor(id: number): void {
        if(!this.gameLogic.actors.has(id)) return;
        const body = this.gameLogic.actors.get(id)!.body;
        this.gameLogic.removeActor(id);
        Composite.remove(this.engine.world, body);
    }

    update(millisec: number): void {
        MatterEngine.update(this.engine, millisec);
    }

    showData(show: boolean): void {
        this.#term.showData(show);
    }

    addBody(body: Matter.Body): void {
        World.add(this.engine.world, body);
    }

    removeBody(body: Matter.Body): void {
        World.remove(this.engine.world, body);
    }

    getValidId(): number {
        return this.gameLogic.getValidID();
    }
}

class EntityEntry implements IEntity {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    scale: [number, number];
    tint: number;
    width: number;
    height: number;
    gameData: any;
    update(): void {
        throw new Error("Method not implemented.");
    }

    constructor(actor: Actor){
        this.id = actor.getID();
        this.x = actor.body.position.x;
        this.y = actor.body.position.y;
        this.vx = actor.body.velocity.x;
        this.vy = actor.body.velocity.y;
        this.scale = actor.getScale();
        this.tint = actor.getTint();
        this.width = actor.getWidth();
        this.height = actor.getHeight();
        this.gameData = actor.gameData;
    }
}
