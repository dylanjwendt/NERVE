jest.mock("colyseus");
import { Server } from "colyseus";
import { MainRoom } from "../src/main-room";
import { NerveServer } from "../src/nerve-server";

describe("nerve server", () => {

    it("start should create colyseus server", () => {
        const mockServer: Server = new Server();
        jest.spyOn(mockServer, "attach");
        const serverMain = new NerveServer(mockServer);
        serverMain.start("localhost", 2567);
        expect(mockServer.attach).toHaveBeenCalledTimes(1);
    });


    it("should listen on host and port", () => {
        const mockServer: Server = new Server();
        jest.spyOn(mockServer, "listen");
        const serverMain = new NerveServer(mockServer);
        serverMain.start("localhost", 2567);
        expect(mockServer.listen).toHaveBeenCalledTimes(1);
        expect(mockServer.listen).toHaveBeenCalledWith(2567, "localhost");
    });

    it("should define room", () => {
        const mockServer: Server = new Server();
        jest.spyOn(mockServer, "define");
        const serverMain = new NerveServer(mockServer);
        serverMain.start("localhost", 2567);
        expect(mockServer.define).toHaveBeenCalledWith("mainroom", MainRoom);
    });

});