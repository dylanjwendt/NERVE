import System from "./system";

export default abstract class InputHandler extends System {
    constructor() {
        super();
        this.sysName = "InputHandler";
    }

    abstract handleKeyDown(actorId: number, key: string): void;
    abstract handleKeyUp(actorId: number, key: string): void;
    abstract handleMouseDownInput(actorId: number, pos: [number, number]): void;
    abstract handleMouseUpInput(actorId: number, pos: [number, number]): void;
    abstract handleMouseMoveInput(actorId: number, pos: [number, number]): void;
}