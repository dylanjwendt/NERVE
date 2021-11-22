/**
 * Paramters used for configuring the cleint, server, and engine.
 * 
 * Current paramaters:
 * 
 * client - The client's smoothing and prediction thresholds
 * 
 * clientServer - The port and route for the http/koa server (handles the client connections)
 * 
 * server - The port and host domain the colyseus server (handles the game server connections)
 * 
 * engine - The game engine paramters such as world size, bots, and other world/gane customizations.
 * 
 */
export const NerveConfig = {
  client: {
    smoothing: 0.2,
    predictionThreshold: 500
  },
  clientServer: {
    // Client root is relative to Server/
    clientRoot: "../DemoHtmlClient/dist",
    port: 3000
  },
  server: {
    hostName: "localhost",
    port: 2567
  },
  engine: {
    worldWidth: 5000,
    worldHeight: 5000,
    numBotsPerPlayer: 5,
    numBlackHoles: 10
  }
};
