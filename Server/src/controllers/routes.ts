import KoaRouter from "@koa/router";
import parseBody from "koa-bodyparser";
import { listRooms } from "./room-controller";

/**
 * setup middleware (http routes)
 */
export async function getRoutes(): Promise<KoaRouter.Middleware> {
    const router = new KoaRouter();
    router.prefix("/api");
    router.get("/listRooms", listRooms);
    return router.routes();
}