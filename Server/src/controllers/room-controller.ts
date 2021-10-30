import type { Context } from "koa";

// get
async function listRooms(ctx: Context) {
    const rooms = await ctx.gameServer.listRooms();
    ctx.body = JSON.stringify(rooms);
    ctx.status = 200;
}

export {
    listRooms
};