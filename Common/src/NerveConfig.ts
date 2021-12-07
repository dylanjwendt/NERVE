export const NerveConfig = {
  client: {
    smoothing: 0.2,
    predictionThreshold: 500
  },
  // For the http/koa server (handles the client connections)
  clientServer: {
    // Client root is relative to Server/
    clientRoot: "../DemoHtmlClient/dist",
    port: 3000
  },
  // For the colyseus server (handles the game server connections)
  server: {
    hostName: "0.0.0.0",
    port: 2567
  },
  engine: {
    worldWidth: 5000,
    worldHeight: 5000,
    numBotsPerPlayer: 5,
    numBlackHoles: 10
  }
};
