import { World, InputHandler, GameLogic } from "nerve-engine";
import Bullet from "./actors/Bullet";
import Player from "./actors/Player";
// import PlayerActor from "./actors/Player";

export default class DemoInputHandler extends InputHandler {
    private world;
    private logic;

    constructor(world: World, logic: GameLogic) {
        super();
        this.world = world;
        this.logic = logic;
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
        }
    }

    handleMouseDownInput(actorId: string, pos: [number, number]): void {
        const id = this.logic.getValidID();
        const player = this.logic.actors.get(actorId);
        if (!player) return;
        const pcoords = player.getCoords().toVector();
        pcoords.x += player.getWidth() / 2 - 8; // magic 8
        pcoords.y += player.getHeight() / 2 - 8;
        const bullet = new Bullet(id, [pcoords!.x, pcoords!.y], pos);
        this.logic.addNewActor(id, bullet);
    }

    handleMouseUpInput(actorId: string, pos: [number, number]): void {
        // TODO:
    }

    handleMouseMoveInput(actorId: string, pos: [number, number]): void {
        // TODO:
    }
}