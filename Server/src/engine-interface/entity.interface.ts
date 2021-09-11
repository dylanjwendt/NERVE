export interface IEntity {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    scale: [number, number];
    tint: number;  // hexadecimal
    width: number;
    height: number;
    update(): void;
  }
  