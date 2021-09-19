import { IEntity } from "nerve-common";
import { IInputHandler } from "./input-handler.interface";

export interface IEngine {
    inputHandler: IInputHandler;
    addPlayerActor(id: number): void;
    changeUsernameAndClass(id: number, newName: string, newClass : number): void;
    removeActor(id: number): void;
    update(millisec: number): void;
    getWorldState(): IEntity[];
    getValidId(): number;
}
