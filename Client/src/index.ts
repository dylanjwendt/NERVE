import './index.less';
import * as PIXI from 'pixi.js';
import { Sprite, Texture } from 'pixi.js';
import DebugScreen from './debug-screen';
import { NerveClient } from '../../Server/src/nerve-client';
import { SimpleGameState } from '../../Server/src/simple-game-state';
import Entity from './entity';

(async function start() {
  console.log('hello from top-level client side JS');

  PIXI.utils.sayHello('Hello World!');

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

  const server = new NerveClient();
  let playerId = '';
  await server.connect('ws://localhost:2567');

  server.onStateChange((state: SimpleGameState) => {
    const entityList: any[] = JSON.parse(state.text);
    entityList.forEach((e: any) => {
      if (entities.has(e.id)) {
        const entity = entities.get(e.id);
        if (entity) {
          entity.sprite.x = e.x;
          entity.sprite.y = e.y;
          entity.vx = e.vx;
          entity.vy = e.vy;
          entities.set(e.id, entity);
        }
      } else {
        const newSprite = new Sprite(Texture.from('../res/circle.png'));
        newSprite.scale.set(e.scale[0], e.scale[1]);
        newSprite.tint = e.tint;
        newSprite.x = e.x;
        newSprite.y = e.y;
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

  const keysDown = new Set();
  document.addEventListener('keydown', (e) => {
    if (!keysDown.has(e.key)) {
      server.send('keydown', JSON.stringify({ player: playerId, key: e.key }));
      keysDown.add(e.key);
    }
  });

  document.addEventListener('keyup', (e) => {
    server.send('keyup', JSON.stringify({ player: playerId, key: e.key }));
    keysDown.delete(e.key);
  });

  document.addEventListener('mousedown', (e) => {
    server.send('mousedown', JSON.stringify({ player: playerId, mousePos: [e.clientX, e.clientY] }));
  });

  app.ticker.start();
  app.ticker.add(() => {
    const player = entities.get(playerId);
    DebugScreen.update({
      playerX: player ? player.sprite.x : -1,
      playerY: player ? player.sprite.y : -1,
      fps: app.ticker.FPS,
    });
    entities.forEach((entity) => {
      app.renderer.render(entity.sprite);
    });
  });

  app.ticker.add(() => {
    entities.forEach((entity) => entity.update());
  });
}());
