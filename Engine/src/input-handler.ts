import System from "./system";

export default abstract class InputHandler extends System {
    constructor() {
        super();
        this.sysName = "InputHandler";
    }

    abstract handleKeyDown(Actorid: string, key: string): void;
    abstract handleKeyUp(Actorid: string, key: string): void;
    abstract handleMouseDownInput(Actorid: string, pos: [number, number]): void;
    abstract handleMouseUpInput(Actorid: string, pos: [number, number]): void;
    abstract handleMouseMoveInput(Actorid: string, pos: [number, number]): void;
}