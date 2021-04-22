import { Vec2 } from "./coordinates";
import Actor from "./actor";
import GameLogic from "./game-logic";
import Terminal from "./terminal";
import World from "./world";
import { IEntity } from "./IEntity";
import InputHandler from "./input-handler";

export type Ticker = (world: World, timestep: number) => void;

export default abstract class Engine {
    protected gameLogic: GameLogic;
    #term: Terminal;
    #world: World;
    inputHandler: InputHandler;
    tickers: Ticker[]

    constructor(getHandler: (a: World) => InputHandler) {
        this.#term = new Terminal();
        this.gameLogic = new GameLogic();
        this.#world = new World(this.gameLogic);
        this.inputHandler = getHandler(this.#world);
        this.#term.activate();
        this.gameLogic.activate();
        this.#world.activate();
        this.inputHandler.activate();
        this.tickers = [];
    }

    getWorldState(): IEntity[] {
        const retArr: IEntity[] = [];
        //this.#gameLogic.actors.forEach((e) => retArr.push((e.getCoords().toVector())));
        this.gameLogic.actors.forEach((actor) => {
            retArr.push(new EntityEntry(actor));
        });
        return retArr;
    }

    addActorVel(id: string, vel: Vec2): void {
        this.#world.addActorVel(id, vel);
    }

    setActorVel(id: string, vel: Vec2): void {
        this.#world.setActorVel(id, vel);
    }

    addActorPos(id: string, vel: Vec2): void {
        this.#world.addActorPos(id, vel);
    }

    setActorPos(id: string, vel: Vec2): void {
        this.#world.setActorPos(id, vel);
    }

    addActor(id: string, actor: Actor): void  {
        return this.gameLogic.addNewActor(id, actor);
    }

    removeActor(id: string): void {
        if(this.gameLogic.actors.has(id)) {
            this.gameLogic.actors.delete(id);
        }
    }

    update(millisec: number): void {
        this.#world.moveTimestep(millisec);
        this.tickers.forEach(t => t(this.#world, millisec));
    }

    showData(show: boolean): void {
        this.#term.showData(show);
    }

    addTicker(ticker: Ticker): void {
        this.tickers.push(ticker);
    }
}

class EntityEntry implements IEntity {
    id: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    scale: [number, number];
    tint: number;
    width: number;
    height: number;
    update(): void {
        throw new Error("Method not implemented.");
    }

    constructor(actor: Actor){
        this.id = actor.getID().toString();
        this.x = actor.getCoords().toVector().x;
        this.y = actor.getCoords().toVector().y;
        this.vx = actor.getVelocity().x;
        this.vy = actor.getVelocity().y;
        this.scale = actor.getScale();
        this.tint = actor.getTint();
        this.width = actor.getWidth();
        this.height = actor.getHeight();
    }
}
