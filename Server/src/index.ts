import { NerveServer } from "./nerve-server";

const server = new NerveServer();
server.start("localhost", 2567);