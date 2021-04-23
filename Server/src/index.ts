import { NerveServer } from "./nerve-server";
import Koa from "koa";
import serve from "koa-static";
import path from "path";

const clientRoot = path.join(__dirname, "../../Client/dist");
const PORT = 3000;

(async function () {
    // Start game server
    const server = new NerveServer();
    server.start("localhost", 2567);
    console.log("Started game server");

    const app = new Koa();
    app.use(serve(clientRoot));
    app.listen(PORT, () => {
        console.log(`Started static server on localhost:${PORT}`);
    });
})();
