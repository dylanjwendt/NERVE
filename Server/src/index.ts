import { Startup } from "./startup";
import Koa from "koa";
import serve from "koa-static";
import path from "path";
import config from "@nerve-config";

// Client root is relative to process.cwd() (which should be the root NERVE directory), not Server/src/index.ts
const clientRoot = path.resolve(process.cwd(), config.server.clientRoot);
const PORT = config.server.port;

(async function () {
    // start game server (websockets)
    const server = Startup.start();
    await server.init();
    console.log("Started game server");

    // start koa router (http)
    const app = new Koa();
    app.use(serve(clientRoot));
    app.listen(PORT, () => {
        console.log(`Started static server on localhost:${PORT}`);
    });
})();
