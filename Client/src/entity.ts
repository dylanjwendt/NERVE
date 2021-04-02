import { Sprite } from 'pixi.js';

const smoothing = 0.1;

export default class Entity {
  vx: number;
  vy: number;
  sprite: Sprite;

  constructor(vx: number, vy: number, sprite: Sprite) {
    this.vx = vx;
    this.vy = vy;
    this.sprite = sprite;
  }

  update() {
    this.sprite.x += this.vx * smoothing;
    this.sprite.y -= this.vy * smoothing; // subtract because origin in top-left
  }
}
