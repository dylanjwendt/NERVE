import System from "./system";

export default abstract class InputHandler extends System {
    constructor() {
        super();
        this.sysName = "InputHandler";
    }

    abstract handleKey(ActorID: number, key: string): void;

    abstract handleMouseDownInput(ActorID: number, pos: [number, number]): void;

    abstract handleMouseUpInput(ActorID: number, pos: [number, number]): void;

    abstract handleMouseMoveInput(ActorID: number, pos: [number, number]): void;
}