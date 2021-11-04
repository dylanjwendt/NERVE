import { Startup } from "./startup";
import Koa from "koa";
import serve from "koa-static";
import morgan from "morgan";
import path from "path";
import { NerveConfig } from "nerve-common";
import { getRoutes } from "./controllers/routes";

// Client root is relative to Server/
const isDev = process.env.NODE_ENV === "development";
const clientRoot = path.resolve(process.cwd(), NerveConfig.clientServer.clientRoot);
const PORT = NerveConfig.clientServer.port;
const app = new Koa();

(async function () {
    // start game server (websockets)
    const server = Startup.start();
    await server.init();
    console.log("Started game server");

    // setup middleware and start koa router (http)    
    const logger = morgan(isDev ? "dev" : "combined");
    app.use(async (ctx, next) => {
        logger(ctx.req, ctx.res, () => {/* do nothing */});
        await next();
    });
    
    const routes = await getRoutes();
    app.use(routes);
    app.use(serve(clientRoot));
    app.context.gameServer = server; // add reference to colyseus game server inside koa context
    app.listen(PORT, () => {
        // Don't print message in dev mode, dev server runs on 3001
        if (isDev) {
            console.log("Server running in development mode");
        } else {
            console.log(`Started static server on localhost:${PORT}`);
        }

        console.log(`Serving client root: ${clientRoot}`);
    });
})();

export = app;  // export koa 