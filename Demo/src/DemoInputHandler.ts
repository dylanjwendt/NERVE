import Matter from "matter-js";
import { InputHandler, GameLogic, Actor } from "nerve-engine";
import { DemoEngine } from ".";
import Bullet from "./actors/Bullet";
import Player from "./actors/Player";
import WallPiece from "./actors/WallPiece";

export default class DemoInputHandler extends InputHandler {
    private logic;
    private engine: DemoEngine | null;

    constructor(logic: GameLogic) {
        super();
        this.logic = logic;
        this.engine = null;
    }
    
    setEngine(engine: DemoEngine): void {
        this.engine = engine;
    }

    handleKeyDown(actorId: number, key: string): void {
        const actor = this.logic.actors.get(actorId);
        if(actor instanceof Player) {
            if(key === "w") {
                actor.updateDirection("w");
            }
            else if(key === "a") {
                actor.updateDirection("a");
            }
            else if(key === "s") {
                actor.updateDirection("s");
            }
            else if(key === "d") {
                actor.updateDirection("d");
            }
        }
    }

    handleKeyUp(actorId: number, key: string): void {
        const actor = this.logic.actors.get(actorId);
        if(actor instanceof Player) {
            if(key === "w") {
                actor.updateDirection("-w");
            }
            else if(key === "a") {
                actor.updateDirection("-a");
            }
            else if(key === "s") {
                actor.updateDirection("-s");
            }
            else if(key === "d") {
                actor.updateDirection("-d");
            }
            else if(key === " ") {
                this.spawnWall(actor);
            }
        }
    }

    handleMouseDownInput(actorId: number, pos: [number, number]): void {
        const id = this.logic.getValidID();
        const player = this.logic.actors.get(actorId);
        if (!player) return;
        const pcoords = player.body.position;
        const bullet = new Bullet(id, player as Player, [pcoords.x, pcoords.y], pos, this.engine!.engine, this.logic, this.engine!);
        this.logic.addActor(id, bullet);
    }

    handleMouseUpInput(actorId: number, pos: [number, number]): void {
        // TODO:
    }

    handleMouseMoveInput(actorId: number, pos: [number, number]): void {
        // TODO:
    }

    spawnWall(parent: Actor): void {
        if(this.engine === null) return;
        const numEnt = 15;
        const dist = 100;
        for(let i = 0; i < numEnt; i++) {
            const theta = ((360/numEnt)*i)*Math.PI/180;
            const pos = [parent.body.position.x + (Math.cos(theta)*dist), parent.body.position.y + (Math.sin(theta)*dist)] as [number, number];
            const piece = new WallPiece(this.logic.getValidID(), "todo", this.engine);
            Matter.Body.setPosition(piece.body, Matter.Vector.create(pos[0], pos[1]));
            piece.setTint(0xa1a1a1);
            this.logic.addActor(piece.getID(), piece);
        }
    }
}