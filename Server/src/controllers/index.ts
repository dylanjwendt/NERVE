import KoaRouter from "@koa/router";
import parseBody from "koa-bodyparser";
import { getHello, postHello } from "./hello";

export default async function getRoutes() {
    const router = new KoaRouter();
    router.prefix("/api");

    router.get("/hello", getHello);
    router.post("/hello", parseBody(), postHello);

    return router.routes();
}
