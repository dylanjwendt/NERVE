import './index.less';
import * as PIXI from 'pixi.js';
import { Graphics } from 'pixi.js';

console.log('hello from top-level client side JS');

PIXI.utils.sayHello('Hello World!');

const app = new PIXI.Application({
  width: 256,
  height: 256,
  antialias: true,
  backgroundColor: 0xdedede,
});

const circle = new Graphics();
circle.beginFill(0xd32f2f);
circle.drawCircle(0, 0, 32);
circle.endFill();
circle.x = 128 - 16;
circle.y = 128 - 16;
app.stage.addChild(circle);

document.body.appendChild(app.view);
