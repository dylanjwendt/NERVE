import './index.less';
import * as PIXI from 'pixi.js';
import Player from './entities/player';
import DebugScreen from './debug-screen';
import clamp from './utils/clamp';
import Bullet from './entities/bullet';

console.log('hello from top-level client side JS');

PIXI.utils.sayHello('Hello World!');

const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  antialias: true,
  backgroundColor: 0xf0f0f0,
  resizeTo: window,
});

const player = new Player();
app.stage.addChild(player.sprite);

const entities: any[] = [player];

window.addEventListener('resize', () => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'w') {
    player.updateDirection({ up: true });
  } else if (e.key === 'a') {
    player.updateDirection({ left: true });
  } else if (e.key === 's') {
    player.updateDirection({ down: true });
  } else if (e.key === 'd') {
    player.updateDirection({ right: true });
  }
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'w') {
    player.updateDirection({ up: false });
  } else if (e.key === 'a') {
    player.updateDirection({ left: false });
  } else if (e.key === 's') {
    player.updateDirection({ down: false });
  } else if (e.key === 'd') {
    player.updateDirection({ right: false });
  }
});

document.addEventListener('mousedown', (e) => {
  const bullet = new Bullet([player.sprite.x, player.sprite.y], [e.clientX, e.clientY]);
  app.stage.addChild(bullet.sprite);
  entities.push(bullet);
});

app.ticker.start();
app.ticker.add(() => {
  entities.forEach((e, i) => {
    e.update();
    if (e === player) { return; }
    if (e.sprite.x < 0 || e.sprite.y < 0
      || e.sprite.x > window.innerWidth || e.sprite.y > window.innerHeight) {
      entities.splice(i, 1);
      app.stage.removeChild(e.sprite);
    }
  });

  player.sprite.x = clamp(player.sprite.x, 0, window.innerWidth - player.sprite.width);
  player.sprite.y = clamp(player.sprite.y, 0, window.innerHeight - player.sprite.height);

  DebugScreen.update({
    playerX: player.sprite.x,
    playerY: player.sprite.y,
    fps: app.ticker.FPS,
  });

  entities.forEach((e) => app.renderer.render(e.sprite));
});

document.body.appendChild(app.view);
