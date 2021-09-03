// jest.mock("colyseus");
jest.mock("colyseus.js");
import { Client , Room } from "colyseus.js";
// const { Room } = jest.requireActual("colyseus.js");
import { NerveClient } from  "../src/nerve-client";
import { SimpleGameState } from "../src/simple-game-state";

describe("nerve client server", () => {

    it("connect should join room", () => {
        const mock = new Client("endpoint");
        jest.spyOn(mock, "joinOrCreate");
        const nerveClient = new NerveClient(mock);
        nerveClient.connect("ws://localhost:2567");
        expect(mock.joinOrCreate).toHaveBeenCalledTimes(1);
    });

    // connect should update room value!!!
    it("connect should define room", async () => {
        const mockClient = new Client("endpoint");
        const mockRoom = new Room<unknown>("");
        jest.spyOn(mockClient, "joinOrCreate").mockResolvedValue(mockRoom);
        const nerveClient = new NerveClient(mockClient);
        await nerveClient.connect("ws://localhost:2567");
        expect(nerveClient.getRoom()).toEqual(mockRoom);
    });

    it("send should send message to room", async () => {
        const mockClient = new Client("endpoint");
        const mockRoom = new Room<unknown>("");
        jest.spyOn(mockRoom, "send");
        jest.spyOn(mockClient, "joinOrCreate").mockResolvedValue(mockRoom);
        const nerveClient = new NerveClient(mockClient);
        await nerveClient.connect("ws://localhost:2567");
        nerveClient.send("hello");
        expect(mockRoom.send).toHaveBeenCalledWith("main", "hello");
        // return nerveClient.connect("ws://localhost:2567").then(() => {
        //     nerveClient.send("hello");
        //     return expect(mockRoom.send).toHaveBeenCalledWith("main", "hello");
        // });
    });

    it("send should throw error when not connected to room", () => {
        const mockClient = new Client("endpoint");
        const nerveClient = new NerveClient(mockClient);
        expect(() => nerveClient.send("hello")).toThrowError();
    });

    // it("should register on state change callback", async () => {
    //     const mockClient = new Client("endpoint");
    //     const mockRoom = new Room<unknown>("");
    //     // jest.spyOn(Room.prototype, "onStateChange");
    //     jest.spyOn(mockClient, "joinOrCreate").mockResolvedValue(mockRoom);
    //     const nerveClient = new NerveClient(mockClient);
    //     await nerveClient.connect("ws://localhost:2567");
    //     const callbackFunction = (state: SimpleGameState) => { console.log(state); };
    //     // nerveClient.onStateChange(callbackFunction);
    //     // nerveClient.onStateChange((state: SimpleGameState) => { console.log(state); });
    //     expect(mockRoom.onStateChange).toBeDefined();
    // });

});