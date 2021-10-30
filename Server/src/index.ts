import { Startup } from "./startup";
import Koa from "koa";
import serve from "koa-static";
import path from "path";
import { NerveConfig } from "nerve-common";
import { getRoutes } from "./controllers/routes";

// Client root is relative to Server/
const clientRoot = path.resolve(process.cwd(), NerveConfig.clientServer.clientRoot);
const PORT = NerveConfig.clientServer.port;
const app = new Koa();

(async function () {
    // start game server (websockets)
    const server = Startup.start();
    await server.init();
    console.log("Started game server");

    // setup middleware and start koa router (http) 
    const routes = await getRoutes();
    app.use(routes);
    app.use(serve(clientRoot));
    app.context.gameServer = server;  // add reference to colyseus game server inside koa context
    app.listen(PORT, () => {
        console.log(`Started static server on localhost:${PORT}`);
        console.log(`Serving client root: ${clientRoot}`);
    });
})();

export = app;  // export koa 