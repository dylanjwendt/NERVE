import { IEntity } from "./entity.interface";
import { IInputHandler } from "./input-handler.interface";

export interface IEngine {
    inputHandler: IInputHandler;
    addActor(id: string): void;
    removeActor(id: string): void;
    update(millisec: number);
    getWorldState(): IEntity[];
}
