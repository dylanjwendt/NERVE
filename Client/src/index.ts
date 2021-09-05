import './index.less';
import * as PIXI from 'pixi.js';
import { Sprite, Texture } from 'pixi.js';
import DebugScreen from './debug-screen';
import { NerveClient, SimpleGameState } from 'nerve-server';

import Entity from './entity';

(async function start() {
  const $ = (x: string) => document.querySelector(x);

  console.log('hello from top-level client side JS');
  PIXI.utils.sayHello('Hello World!');

  // Set up Pixi
  const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    antialias: true,
    backgroundColor: 0xf0f0f0,
    resizeTo: window,
  });

  const entities = new Map<string, Entity>();

  window.addEventListener('resize', () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
  });

  document.body.appendChild(app.view);

  // State sync
  const server = new NerveClient();
  let playerId = '';
  await server.connect('ws://localhost:2567');
  let lastSync = Date.now();
  let syncRate = 0;
  server.onStateChange((state: SimpleGameState) => {
    syncRate = Date.now() - lastSync;
    lastSync = Date.now();
    const entityList: any[] = JSON.parse(state.text);
    entityList.forEach((e: any) => {
      if (entities.has(e.id)) {
        const entity = entities.get(e.id);
        if (entity) {
          entity.sprite.x = e.x - e.width / 2;
          entity.sprite.y = e.y - e.height / 2;
          entity.vx = e.vx;
          entity.vy = e.vy;
          entity.sprite.tint = e.tint;
          entities.set(e.id, entity);
        }
      } else {
        const newSprite = new Sprite(Texture.from('../res/circle.png'));
        newSprite.scale.set(e.scale[0], e.scale[1]);
        newSprite.tint = e.tint;
        newSprite.x = e.x - e.width / 2;
        newSprite.y = e.y - e.height / 2;
        entities.set(e.id, new Entity(e.vx, e.vy, newSprite));
        app.stage.addChild(newSprite);
      }
    });

    entities.forEach((entity, key) => {
      if (!entityList.find((e) => e.id === key)) {
        entities.delete(key);
        app.stage.removeChild(entity.sprite);
      }
    });
  });

  server.onMessage('getPlayerId', (message: any) => {
    playerId = message;
  });

  // Input listeners
  const keysDown = new Set();
  const mouse = [0, 0];
  document.addEventListener('keydown', (e) => {
    if (!keysDown.has(e.key)) {
      server.send('keydown', JSON.stringify({ player: playerId, key: e.key }));
      keysDown.add(e.key);
    }
    if (e.key === 't') {
      server.send('mousedown', JSON.stringify({ player: playerId, mousePos: mouse }));
    }
  });

  document.addEventListener('mousemove', (e) => {
    mouse[0] = e.clientX;
    mouse[1] = e.clientY;
  });

  document.addEventListener('keyup', (e) => {
    server.send('keyup', JSON.stringify({ player: playerId, key: e.key }));
    keysDown.delete(e.key);
  });

  document.addEventListener('mousedown', (e) => {
    server.send('mousedown', JSON.stringify({ player: playerId, mousePos: [e.clientX, e.clientY] }));
  });

  // App tickers
  app.ticker.add(() => {
    const player = entities.get(playerId);
    DebugScreen.update({
      playerX: player ? player.sprite.x : -1,
      playerY: player ? player.sprite.y : -1,
      fps: app.ticker.FPS,
      syncRate,
      numEntities: entities.size,
    });
    entities.forEach((entity) => {
      app.renderer.render(entity.sprite);
    });
  });

  // Client side prediction
  app.ticker.add(() => {
    entities.forEach((entity) => entity.update());
  });

  app.ticker.stop();

  // Username handling
  let username: string;
  $('#username')?.addEventListener('keyup', (e) => {
    const overlay = $('#overlay') as HTMLDivElement;
    const evt = e as KeyboardEvent;
    if (evt.key === 'Enter' && overlay) {
      overlay.style.display = 'none';
      username = ($('#username') as HTMLInputElement).value;
      server.send('username', JSON.stringify({ player: playerId, name: username }));
      app.ticker.start();
    }
  });
}());
