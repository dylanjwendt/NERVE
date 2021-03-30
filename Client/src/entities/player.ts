import { Texture, Sprite } from 'pixi.js';
import clamp from '../utils/clamp';
import sign from '../utils/sign';

const maxSpeed = 4;
const acceleration = 0.2;
const deceleration = 0.04;

export interface DirectionsHeld {
  up?: boolean,
  left?: boolean,
  down?: boolean,
  right?: boolean,
}

export default class Player {
  vx: number;
  vy: number;
  sprite: Sprite;
  directionsHeld = {
    up: false,
    left: false,
    down: false,
    right: false,
  };

  constructor() {
    const radius = 16;
    this.vx = 0;
    this.vy = 0;

    this.sprite = new Sprite(Texture.from('../../res/circle.png'));
    this.sprite.x = 128 - radius / 2;
    this.sprite.y = 128 - radius / 2;
    this.sprite.scale.set(1.5, 1.5);
    this.sprite.tint = 0xff4d4d;
  }

  update() {
    this.sprite.x += this.vx;
    this.sprite.y -= this.vy; // origin in top left

    if (!this.directionsHeld.up && !this.directionsHeld.down) {
      this.vy += -deceleration * sign(this.vy);
    }
    if (!this.directionsHeld.left && !this.directionsHeld.right) {
      this.vx += -deceleration * sign(this.vx);
    }
    if (this.directionsHeld.up) {
      this.vy = clamp(this.vy + acceleration, -maxSpeed, maxSpeed);
    }
    if (this.directionsHeld.left) {
      this.vx = clamp(this.vx - acceleration, -maxSpeed, maxSpeed);
    }
    if (this.directionsHeld.down) {
      this.vy = clamp(this.vy - acceleration, -maxSpeed, maxSpeed);
    }
    if (this.directionsHeld.right) {
      this.vx = clamp(this.vx + acceleration, -maxSpeed, maxSpeed);
    }
  }

  updateDirection(directions: DirectionsHeld) {
    Object.assign(this.directionsHeld, directions);
  }
}
