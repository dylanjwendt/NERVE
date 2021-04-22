import { World, InputHandler } from "nerve-engine";
import Player from "./actors/Player";
// import PlayerActor from "./actors/Player";

export default class DemoInputHandler extends InputHandler {
    private world;

    constructor(world: World) {
        super();
        this.world = world;
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
        this.throwError(`Handle key: ${key} from actor ${actorId}`);
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

    handleMouseDownInput(Actorid: string, pos: [number, number]): void {
        // TODO:
    }

    handleMouseUpInput(Actorid: string, pos: [number, number]): void {
        // TODO:
    }

    handleMouseMoveInput(Actorid: string, pos: [number, number]): void {
        // TODO:
    }
}