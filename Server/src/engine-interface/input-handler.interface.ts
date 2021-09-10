export interface IInputHandler {
    handleKeyDown(actorId: number, key: string): void;
    handleKeyUp(actorId: number, key: string): void;
    handleMouseDownInput(actorId: number, pos: [number, number]): void;
    handleMouseUpInput(actorId: number, pos: [number, number]): void;
    handleMouseMoveInput(actorId: number, pos: [number, number]): void;
}