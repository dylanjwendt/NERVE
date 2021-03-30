import { Texture, Sprite } from 'pixi.js';

const speed = 4;

export default class Bullet {
  vx: number;
  vy: number;
  sprite: Sprite;

  constructor(pos1: [number, number], pos2: [number, number]) {
    const normalization = Math.sqrt((pos1[0] - pos2[0]) ** 2 + (pos1[1] - pos2[1]) ** 2);
    this.vx = (pos2[0] - pos1[0]) / normalization;
    this.vy = (pos2[1] - pos1[1]) / normalization;
    this.vx *= speed;
    this.vy *= speed;

    this.sprite = new Sprite(Texture.from('../../res/circle.png'));
    this.sprite.scale.set(0.5, 0.5);
    [this.sprite.x, this.sprite.y] = pos1;
    this.sprite.tint = 0xf5ef42;
  }

  update() {
    this.sprite.x += this.vx;
    this.sprite.y += this.vy;
  }
}
