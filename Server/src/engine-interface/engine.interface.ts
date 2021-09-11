import { IEntity } from "./entity.interface";
import { IInputHandler } from "./input-handler.interface";

export interface IEngine {
    inputHandler: IInputHandler;
    addActor(id: number): void;
    removeActor(id: number): void;
    update(millisec: number): void;
    getWorldState(): IEntity[];
    getValidId(): number;
}
