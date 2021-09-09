import System from "./system";

export default abstract class InputHandler extends System {
    constructor() {
        super();
        this.sysName = "InputHandler";
    }

    abstract handleKeyDown(Actorid: number, key: string): void;
    abstract handleKeyUp(Actorid: number, key: string): void;
    abstract handleMouseDownInput(Actorid: number, pos: [number, number]): void;
    abstract handleMouseUpInput(Actorid: number, pos: [number, number]): void;
    abstract handleMouseMoveInput(Actorid: number, pos: [number, number]): void;
}