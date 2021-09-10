export interface IInputHandler {
    handleKeyDown(actorId: string, key: string): void;
    handleKeyUp(actorId: string, key: string): void;
    handleMouseDownInput(actorId: string, pos: [number, number]): void;
    handleMouseUpInput(actorId: string, pos: [number, number]): void;
    handleMouseMoveInput(actorId: string, pos: [number, number]): void;
}