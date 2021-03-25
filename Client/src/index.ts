import './index.less';
import * as PIXI from 'pixi.js';
import Player from './player';
import DebugScreen from './debug-screen';
import clamp from './utils/clamp';

console.log('hello from top-level client side JS');

PIXI.utils.sayHello('Hello World!');

const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  antialias: true,
  backgroundColor: 0xf0f0f0,
  resizeTo: window,
});

window.addEventListener('resize', () => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
});

const player = new Player();
app.stage.addChild(player.sprite);

document.addEventListener('keydown', (e) => {
  console.log(e.key);
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
  console.log(e.key);
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

app.ticker.start();
app.ticker.add(() => {
  player.update();

  player.sprite.x = clamp(player.sprite.x, 0, window.innerWidth - player.sprite.width);
  player.sprite.y = clamp(player.sprite.y, 0, window.innerHeight - player.sprite.height);

  DebugScreen.update({
    playerX: player.sprite.x,
    playerY: player.sprite.y,
  });

  app.renderer.render(player.sprite);
});

document.body.appendChild(app.view);
