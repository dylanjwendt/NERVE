import { createServer } from 'http'
import Koa from 'koa'
import serve from 'koa-static'
import { Server } from 'colyseus'
import { getRoutes } from './controllers'

const app = new Koa()

const url = 'http://localhost'
const port = 3000
let serverStart = Date.now()

async function setupMiddleware () {
  const routes = await getRoutes()
  app.use(routes)

  app.use(serve('../../Client/dist/'))
}

;(async function () { // async IIFE wrapper instead of promises
  try {
    await setupMiddleware()
    const gameServer = new Server({
      server: createServer(app.callback())
    })

    await gameServer.listen(port)
    console.log(`Server started in ${Date.now() - serverStart}ms and is now running at ${url}:${port}`)
  } catch(err) {
    console.log('Failed to start server due to error:')
    console.log(err)
    process.exit(1)
  }
})()

export = app;
