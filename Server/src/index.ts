import { Startup } from "./startup";
import Koa from "koa";
import serve from "koa-static";
import path from "path";
import { NerveConfig } from "nerve-common";

// Client root is relative to Server/
const clientRoot = path.resolve(process.cwd(), NerveConfig.server.clientRoot);
const PORT = NerveConfig.server.port;

(async function () {
    // start game server (websockets)
    const server = Startup.start();
    await server.init();
    console.log("Started game server");

    // start koa router (http)
    const app = new Koa();
    app.use(serve(clientRoot));
    app.listen(PORT, () => {
        // Don't print message in dev mode, dev server runs on 3001
        if (process.env.NODE_ENV == "development") {
            console.log("Server running in development mode");
        } else {
            console.log(`Started static server on localhost:${PORT}`);
        }

        console.log(`Serving client root: ${clientRoot}`);
    });
})();
