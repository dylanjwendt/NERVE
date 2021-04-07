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

  add(vec: Vec2) {
      this.x += vec.x;
      this.y += vec.y;
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

  getDistanceTo(target: EuclideanCoordinates) {
      return Math.sqrt((this.#xPos - target.#xPos) ** 2 + (this.#yPos - target.#yPos) ** 2);
  }

  getDistanceFromOrigin() {
      return Math.sqrt((this.#xPos) ** 2 + (this.#yPos) ** 2);
  }

  addVector(vec: Vec2) {
      this.#xPos += vec.x;
      this.#yPos += vec.y;
  }

  toVector(): Vec2 {
      return new Vec2(this.#xPos, this.#yPos);
  }
}
