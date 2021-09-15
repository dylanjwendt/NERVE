import { Startup } from "./startup";
import Koa from "koa";
import serve from "koa-static";
import path from "path";

const clientRoot = path.join(__dirname, "../../Client/dist");
const PORT = 3000;

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
