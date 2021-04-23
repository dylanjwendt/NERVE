abstract class Coordinates {
  abstract getDistanceTo(target: Coordinates): number;
  abstract getDistanceFromOrigin(): number;
}

export class Vec2 {
  x: number;
  y: number;

  constructor(xInit = 0, yInit = 0) {
      this.x = xInit;
      this.y = yInit;
  }

  add(vec: Vec2): Vec2 {
      this.x += vec.x;
      this.y += vec.y;
      return this;
  }

  clamp(max: number): Vec2 {
      if(this.x > max)
      {
          this.x = max;
      }
      if(this.x < -1*max)
      {
          this.x = -1*max;
      }
      if(this.y > max)
      {
          this.y = max;
      }
      if(this.y < -1*max)
      {
          this.y = -1*max;
      }
      return this;
  }

  mul(x: number, y: number = x): Vec2 {
      this.x = this.x * x;
      this.y = this.y * y;
      return this;
  }

  decel(vec: Vec2): Vec2 {
      if(this.x > 0) {
          this.x = Math.max(0, this.x - vec.x);
      }
      else
      {
          this.x = Math.min(0, this.x + vec.x);
      }
      if(this.y > 0) {
          this.y = Math.max(0, this.y - vec.y);
      }
      else
      {
          this.y = Math.min(0, this.y + vec.y);
      }
      return this;
  }

  normalize(): Vec2 {
      return this.mul(1 / this.magnitude());
  }

  magnitude(): number {
      return Math.sqrt(this.x ** 2 + this.y ** 2);
  }
}

export default class EuclideanCoordinates extends Coordinates {
  #xPos: number;

  #yPos: number;

  constructor(x = 0, y = 0) {
      super();
      this.#xPos = x;
      this.#yPos = y;
  }

  getDistanceTo(target: EuclideanCoordinates): number {
      return Math.sqrt((this.#xPos - target.#xPos) ** 2 + (this.#yPos - target.#yPos) ** 2);
  }

  getVectorTo(target: EuclideanCoordinates): Vec2 {
      return new Vec2(this.#xPos - target.#xPos, this.#yPos - target.#yPos);
  }

  getDistanceFromOrigin(): number {
      return Math.sqrt((this.#xPos) ** 2 + (this.#yPos) ** 2);
  }

  addVector(vec: Vec2): void {
      this.#xPos += vec.x;
      this.#yPos += vec.y;
  }

  toVector(): Vec2 {
      return new Vec2(this.#xPos, this.#yPos);
  }
}
