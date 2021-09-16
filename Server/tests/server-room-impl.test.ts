import { Client } from "colyseus";
import { IEngine } from "../src/engine-interface/engine.interface";
import { IEntity } from "@nerve-common/IEntity";
import { mock, mockDeep } from "jest-mock-extended";
import { ServerRoomImpl } from "../src/colyseus/server-room-impl";
import { ColyseusRoom } from "../src/colyseus/colyseus-room";

describe("server room", () => {

    const mockEngine = mockDeep<IEngine>();
    const mockColyseusRoom = mock<ColyseusRoom>();
    let room: ServerRoomImpl;

    beforeEach(() => {
        room = new ServerRoomImpl(mockEngine, mockColyseusRoom);
    });

    test("should initialize colyseus room", () => {
        room.onCreate(mockColyseusRoom);
        expect(mockColyseusRoom.setSimulationInterval).toHaveBeenCalled();
        expect(mockColyseusRoom.setPatchRate).toHaveBeenCalled();
        expect(mockColyseusRoom.setState).toHaveBeenCalled();
        expect(mockColyseusRoom.onMessage).toBeDefined();
    }); 

    test("should send input to engine", () => {
        const message: any = {player: "a", key: "w"};
        room.onMessage("keydown", JSON.stringify(message));
        expect(mockEngine.inputHandler.handleKeyDown).toHaveBeenCalled();
        room.onMessage("keyup", JSON.stringify(message));
        expect(mockEngine.inputHandler.handleKeyUp).toHaveBeenCalled();
        room.onMessage("mousedown", JSON.stringify(message));
        expect(mockEngine.inputHandler.handleMouseDownInput).toHaveBeenCalled();
    });

    test("should accept username input", () => {
        const message: any = {player: "a", name: "aaa"};
        room.onMessage("username", JSON.stringify(message));
        // idk what to assert
    });

    test("should add actor on join", () => {
        const exampleClient = mock<Client>();
        const clientId = 1;
        mock(mockEngine.getValidId).mockReturnValue(clientId);
        room.onJoin(exampleClient);
        expect(mockEngine.addPlayerActor).toHaveBeenCalledWith(clientId);
    });

    test("should remove actor on leave", () => {
        const exampleClient = mock<Client>();
        const mockMap = mock<Map<string, number>>();
        mock(mockMap.get).mockReturnValue(69);
        room = new ServerRoomImpl(mockEngine, mockColyseusRoom, mockMap);
        room.onLeave(exampleClient);
        expect(mockEngine.removeActor).toHaveBeenCalledWith(69);
    });

    test("update should get engine world state", () => {
        const exampleEntity: IEntity = {
            id: 0,
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            scale: [0, 0],
            tint: 0,
            width: 0,
            height: 0,
            update: function (): void {
                throw new Error("Function not implemented.");
            }
        };
        mockEngine.getWorldState.mockReturnValue([exampleEntity]);
        room.update(69);
        expect(mockEngine.update).toHaveBeenCalled();
        expect(mockColyseusRoom.state.text).toEqual(JSON.stringify([exampleEntity]));
    });
});