import { Body, Vector} from "matter-js";
import { InputHandler, GameLogic, Actor } from "nerve-engine";
import { DemoEngine } from ".";
import Bullet from "./actors/Bullet";
import Player from "./actors/Player";
import WallPiece from "./actors/WallPiece";

export default class DemoInputHandler extends InputHandler {
    private logic: GameLogic;
    private engine: DemoEngine | null;

    /**
     * @param logic Reference to Engine's GameLogic
     */
    constructor(logic: GameLogic) {
        super();
        this.logic = logic;
        this.engine = null;
    }
    
    /**
     * Set the engine of this Handler
     * @param engine Reference to DemoEngine
     */
    setEngine(engine: DemoEngine): void {
        this.engine = engine;
    }

    /**
     * 
     * @param actorId ID of Player recieving input
     * @param key string of input key being pressed
     */
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

    /**
     * 
     * @param actorId ID of Player recieving input
     * @param key string of input key being released
     */
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

    /**
     * 
     * @param actorId ID of Player recieving input
     * @param pos 2d coordinate of mouse click position
     * @returns No return value.
     */
    handleMouseDownInput(actorId: number, pos: [number, number]): void {
        const id = this.logic.getValidID();
        const player = this.logic.actors.get(actorId);
        if (!player) return;
        const pcoords = player.body.position;
        const playerActor = player as Player;
        const bullet = new Bullet(id, playerActor, [pcoords.x, pcoords.y], pos, this.engine!.engine, this.logic, this.engine!);
        this.logic.addActor(id, bullet);
    }

    handleMouseUpInput(actorId: number, pos: [number, number]): void {
        // TODO:
    }

    handleMouseMoveInput(actorId: number, pos: [number, number]): void {
        // TODO:
    }

    /**
     * Spawns a ring of walls around the player
     * @param parent Reference to Parent PlayerActor
     * @returns No Return Value
     */
    spawnWall(parent: Actor): void {
        if(this.engine === null) return;
        const numEnt = 15;
        const dist = 100;
        for(let i = 0; i < numEnt; i++) {
            const theta = ((360/numEnt)*i)*Math.PI/180;
            const pos = [parent.body.position.x + (Math.cos(theta)*dist), parent.body.position.y + (Math.sin(theta)*dist)] as [number, number];
            const piece = new WallPiece(this.logic.getValidID(), "", this.engine);
            Body.setPosition(piece.body, Vector.create(pos[0], pos[1]));
            piece.setTint(0xa1a1a1);
            this.logic.addActor(piece.getID(), piece);
        }
    }
}