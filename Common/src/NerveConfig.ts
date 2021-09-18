export const NerveConfig = {
  client: {
    smoothing: 0.2,
    predictionThreshold: 500
  },
  server: {
    // Client root is relative to Server/
    clientRoot: "../DemoHtmlClient/dist",
    port: 3000
  },
  engine: {
    worldWidth: 5000,
    worldHeight: 5000
  }
};
