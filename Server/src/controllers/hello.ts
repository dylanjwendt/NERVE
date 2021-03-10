import type { Context } from 'koa';

async function getHello(ctx: Context) {
  ctx.body = 'Hello World from the Hello Controller!!';
}

async function postHello(ctx: Context) {
  console.log(JSON.stringify(ctx.request.body));
  ctx.status = 204; // No Content
}

export {
  getHello,
  postHello,
};
