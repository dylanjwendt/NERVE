import { Sprite } from 'pixi.js';

const smoothing = 0.2;

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
    let normalization = Math.sqrt(this.vx ** 2 + this.vy ** 2);
    normalization = normalization === 0 ? 1 : normalization;

    this.sprite.x += (this.vx / normalization) * smoothing;
    this.sprite.y -= (this.vy / normalization) * smoothing; // subtract because origin in top-left
  }
}
