import { Client , Room as ClientRoom } from "colyseus.js";
import { NerveServer } from  "../src/nerve-server";
import { Server } from "colyseus";
import { mock } from "jest-mock-extended";

jest.mock("colyseus", () => ({
    ...jest.requireActual("colyseus"),
    speak: jest.fn()
}));

jest.mock("http", () => ({
    ...jest.requireActual("http"),
    speak: jest.fn()
}));

jest.mock("tsyringe", () => ({
    ...jest.requireActual("tsyringe"),
    speak: jest.fn()
}));

describe("nerve server", () => {

    const mockColyseusClient = mock<Client>();
    const mockColyseusServer = mock<Server>();
    const mockConfig = {host: "localhost", "port": 2567};
    const ENDPOINT = "ws://localhost:2567";

    test("init should attach http server", async () => {
        const server = new NerveServer(mockColyseusClient, mockColyseusServer, mockConfig);
        await server.init();
        expect(mockColyseusServer.attach).toHaveBeenCalled();
    });

    test("init should define room", async () => {
        const server = new NerveServer(mockColyseusClient, mockColyseusServer, mockConfig);
        await server.init();
        expect(mockColyseusServer.define).toHaveBeenCalled();
    });

    test("init should start listening", async () => {
        const server = new NerveServer(mockColyseusClient, mockColyseusServer, mockConfig);
        await server.init();
        expect(mockColyseusServer.listen).toHaveBeenCalledWith(mockConfig.port, mockConfig.host);
    });

    test("connect should join or create room", async () => {
        const server = new NerveServer(mockColyseusClient, mockColyseusServer, mockConfig);
        await server.connect(ENDPOINT);
        expect(mockColyseusClient.joinOrCreate).toHaveBeenCalledWith("mainroom");
    });

    test("connect should keep reference to room", async () => {
        const mockRoom = mock<ClientRoom>();
        mockColyseusClient.joinOrCreate.mockResolvedValue(mockRoom);
        const server = new NerveServer(mockColyseusClient, mockColyseusServer, mockConfig);
        await server.connect(ENDPOINT);
        expect(server["room"]).toBeDefined();
    });

    test("send should forward to room", async () => {
        const mockRoom = mock<ClientRoom>();
        mockColyseusClient.joinOrCreate.mockResolvedValue(mockRoom);
        const server = new NerveServer(mockColyseusClient, mockColyseusServer, mockConfig);
        await server.connect(ENDPOINT);
        server.send("type", "hello");
        expect(mockRoom.send).toHaveBeenCalledWith("type", "hello");
    });

    test("send message before connecting should throw", () => {
        const server = new NerveServer(mockColyseusClient, mockColyseusServer, mockConfig);
        expect(() => {server.send("type", "hello");}).toThrowError();
    });
});