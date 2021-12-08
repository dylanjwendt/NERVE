import Actor from "./actor";
import GameLogic from "./game-logic";
import Terminal from "./terminal";
import { IEntity } from "nerve-common";
import InputHandler from "./input-handler";
import { Engine as MatterEngine, Events, Composite, World }from "matter-js";

/**
 * Represents the game engine which is responible for handling the physics, 
 * actors, interactions, and the like.
 */
export default abstract class Engine {
    /** The functions and other logic the engine follows */
    gameLogic: GameLogic;
    /** The access terminal of the game engine */
    #term: Terminal;
    /** Handles received inputs for the engine */
    inputHandler: InputHandler;
    /** The matter.js physics engine */
    engine: Matter.Engine;

    /**
     * Creates a new engine
     * @param getHandler The input handler for the engine
     */
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
                let actorA: Actor | undefined;
                let actorB: Actor | undefined;
                if (pair.bodyA.isSensor && pair.bodyB.isSensor) 
                {
                    continue;
                }
                else if (pair.bodyA.isSensor) {
                    const id1 = +pair.bodyA.label;
                    const id2 = pair.bodyB.id;
                    actorA = actors.get(id1);
                    actorB = actors.get(id2);
                }
                else if (pair.bodyB.isSensor) {
                    const id1 = pair.bodyA.id;
                    const id2 = +pair.bodyB.label;
                    actorA = actors.get(id1);
                    actorB = actors.get(id2);
                }
                else {
                    const id1 = pair.bodyA.id;
                    const id2 = pair.bodyB.id;
                    actorA = actors.get(id1);
                    actorB = actors.get(id2);
                }
                if(!actorA || !actorB) {
                    continue;
                }
                actorA.triggerInteractions(actorB, type);
                actorB.triggerInteractions(actorA, type);
            }
        }
        Events.on(this.engine, "collisionStart", (e) => handleEvent(e, this.gameLogic.actors, "Start"));
        Events.on(this.engine, "collisionActive", (e) => handleEvent(e, this.gameLogic.actors, "Active"));
        Events.on(this.engine, "collisionEnd", (e) => handleEvent(e, this.gameLogic.actors, "End"));
    }

    /**
     * Fetch a list of all actors and relevent data for display
     * @returns List of IEntity Objects containing information of current objects.
     */
    getWorldState(): IEntity[] {
        const retArr: IEntity[] = [];
        this.gameLogic.actors.forEach((actor) => {
            retArr.push(new EntityEntry(actor));
        });
        return retArr;
    }

    /**
     * Adds a new actor to the engine
     * @param id ID of actor to Add. Only use the getValidID() function of engine to get values for this.
     * @param actor Reference to Actor to add
     */
    addActor(id: number, actor: Actor): void  {
        this.gameLogic.addActor(id, actor);
        Composite.add(this.engine.world, actor.body);
    }

    /**
     * Removes an actor from the engine
     * @param id ID of actor to Remove.
     * @returns No Return Value
     */
    removeActor(id: number): void {
        if(!this.gameLogic.actors.has(id)) return;
        const body = this.gameLogic.actors.get(id)!.body;
        this.gameLogic.removeActor(id);
        Composite.remove(this.engine.world, body);
    }

    /**
     * Move engine forward by provided delta Time
     * @param millisec Duration since last update
     */
    update(millisec: number): void {
        MatterEngine.update(this.engine, millisec);
    }   

    /**
     * DEPRECATED FUNCTION
     * @param show Boolean to send output to terminal log.
     */
    showData(show: boolean): void {
        this.#term.showData(show);
    }

    /**
     * Add a Matter.js body for simulation
     * @param body Body to register with the world.
     */
    addBody(body: Matter.Body): void {
        World.add(this.engine.world, body);
    }

    /**
     * Remove a Matter.js body from simulation
     * @param body Register to remove from world.
     */
    removeBody(body: Matter.Body): void {
        World.remove(this.engine.world, body);
    }

    /**
     * Get a valid ID from the GameLogic
     * @returns valid Numeric ID of object.
     */
    getValidId(): number {
        return this.gameLogic.getValidID();
    }
}

/**
 * Used for representing entity (actor) data which is passed to the server
 */
class EntityEntry implements IEntity {
    /** The id of the entity */
    id: number;
    /** The x position of the entity */
    x: number;
    /** The y position of the entity */
    y: number;
    /** The visual x position of the entity */
    vx: number;
    /** The visual y position of the entity */
    vy: number;
    /** The scale of the entity's texture */
    scale: [number, number];
    /** The tint of the entity's texture */
    tint: number;
    /** The sprite of the entity */
    texture: string;
    /** The width of the entity */
    width: number;
    /** The height of the entity */
    height: number;
    /** Extra game data of the entity */
    gameData: any; // eslint-disable-line
    update(): void {
        // IEntity only serves to pass data between engine and client
        throw new Error("Cannot update IEntity from backend. This method should only be called on the client.");
    }

    /**
     * Creates a new EntityEntry
     * @param actor The actor in which the data is taken from
     */
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
        this.texture = actor.texture;
    }
}
