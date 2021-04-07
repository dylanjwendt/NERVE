import InputHandler from "../inputHandler";
import PlayerActor from "./PlayerActor";
import World from "../world";

export default class PlayerInputHandler extends InputHandler {
    private world;

    constructor(world: World) {
        super();
        this.world = world;
    }
    
    handleKey(ActorID: number, key: string): void {
        const actor = this.world.getActorById(ActorID);
        if(actor instanceof PlayerActor) {
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

    handleMouseDownInput(ActorID: number, pos: [number, number]): void {
        //TODO
    }

    handleMouseUpInput(ActorID: number, pos: [number, number]): void {
        //TODO
    }

    handleMouseMoveInput(ActorID: number, pos: [number, number]): void {
        //TODO
    }
}