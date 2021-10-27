export const NerveConfig = {
  client: {
    smoothing: 0.2,
    predictionThreshold: 500
  },
  //For the Colyseus server (handles the client connections)
  clientServer: {
    // Client root is relative to Server/
    clientRoot: "../DemoHtmlClient/dist",
    port: 3000
  },
  //For the server (handles the server connections)
  server: {
    hostName: "localhost",
    port: 2567
  },
  engine: {
    worldWidth: 5000,
    worldHeight: 5000
  }
};
