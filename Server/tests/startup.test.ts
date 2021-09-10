import { Server } from "colyseus";
import { Startup } from "../src/startup";
import { ServerRoomImpl } from "../src/colyseus/server-room-impl";
import { ServerConfig } from "../src/server-config";
import { container } from "tsyringe";
import { DemoEngine } from "nerve-demo";
import { ColyseusRoom } from "../src/colyseus/colyseus-room";
import { NerveServer } from "../src/nerve-server";
jest.mock("tsyringe", () => ({
    ...jest.requireActual("tsyringe"),
    speak: jest.fn()
}));

describe("startup", () => {

    beforeEach(() => {
        Startup.start();
    });

    afterEach(() => {
        container.clearInstances();
    });

    test("should register config", () => {
        jest.spyOn(container, "register");
        Startup.start();
        const expected: ServerConfig = {host: "localhost", port: 2567};
        expect(container.register).toHaveBeenCalledWith("Config", {useValue: expected});
        expect(container.resolve("Config")).toMatchObject(expected);
    });

    test("should register colyseus server", () => {
        expect(container.resolve("ColyseusServer")).toBeInstanceOf(Server);
    });

    test("should register colyseus client", () => {
        expect(container.resolve("ColyseusClient")).toBeDefined();
    });

    test("should register instance of engine", () => {
        expect(container.resolve("Engine")).toBeInstanceOf(DemoEngine);
    });

    test("should register colyseus room", () => {
        expect(container.resolve("ColyseusRoom")).toBeInstanceOf(ColyseusRoom);
    });

    test("should register game room implemeantation", () => {
        expect(container.resolve("Room")).toBeInstanceOf(ServerRoomImpl);
    });

    test("should return instance of server", () => {
        expect(container.resolve("NerveServer")).toBeInstanceOf(NerveServer);
    });
});