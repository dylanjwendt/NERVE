import { NerveClient } from "../src/nerve-client";
import { NerveServer } from "../src/nerve-server";

describe("startup", () => {

    it("nerve client should initialize own colyseus stuff", () => {
        const client = new NerveClient();
        expect(client).toBeDefined();
    });

    it("nerve server should initialize own colyseus stuff", () => {
        const server = new NerveServer();
        expect(server).toBeDefined();
    });

});