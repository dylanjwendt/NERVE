import { World, InputHandler, GameLogic, Actor, EuclideanCoordinates } from "nerve-engine";
import { DemoEngine } from ".";
import Bullet from "./actors/Bullet";
import Player from "./actors/Player";
import WallPiece from "./actors/WallPiece";

export default class DemoInputHandler extends InputHandler {
    private world;
    private logic;
    private engine: DemoEngine | null;

    constructor(world: World, logic: GameLogic) {
        super();
        this.world = world;
        this.logic = logic;
        this.engine = null;
    }
    
    setEngine(engine: DemoEngine) {
        this.engine = engine;
    }

    handleKeyDown(actorId: string, key: string): void {
        const actor = this.world.getActorById(actorId);
        if(actor instanceof Player) {
            if(key === "w") {
                actor.updateDirection("up");
            }
            else if(key === "a") {
                actor.updateDirection("left");
            }
            else if(key === "s") {
                actor.updateDirection("down");
            }
            else if(key === "d") {
                actor.updateDirection("right");
            }
        }
    }

    handleKeyUp(actorId: string, key: string): void {
        const actor = this.world.getActorById(actorId);
        if(actor instanceof Player) {
            if(key === "w") {
                actor.updateDirection("down");
            }
            else if(key === "a") {
                actor.updateDirection("right");
            }
            else if(key === "s") {
                actor.updateDirection("up");
            }
            else if(key === "d") {
                actor.updateDirection("left");
            }
            else if(key === " ") {
                this.spawnWall(actor);
            }
        }
    }

    handleMouseDownInput(actorId: string, pos: [number, number]): void {
        const id = this.logic.getValidID();
        const player = this.logic.actors.get(actorId);
        if (!player) return;
        const pcoords = player.getCoords().toVector();
        const bullet = new Bullet(id, player as Player, [pcoords!.x, pcoords!.y], pos);
        this.logic.addActor(id, bullet);
    }

    handleMouseUpInput(actorId: string, pos: [number, number]): void {
        // TODO:
    }

    handleMouseMoveInput(actorId: string, pos: [number, number]): void {
        // TODO:
    }

    spawnWall(parent: Actor): void {
        if(this.engine === null) return;
        const numEnt = 15;
        const dist = 100;
        for(let i = 0; i < numEnt; i++) {
            const theta = ((360/numEnt)*i)*Math.PI/180;
            const pos = [parent.getCoords().toVector().x + (Math.cos(theta)*dist), parent.getCoords().toVector().y + (Math.sin(theta)*dist)] as [number, number];
            const piece = new WallPiece(this.logic.getValidID(), "todo", this.engine);
            piece.setCoords(new EuclideanCoordinates(pos[0], pos[1]));
            piece.setTint(0xa1a1a1);
            this.logic.addActor(piece.getID(), piece);
        }
    }
}