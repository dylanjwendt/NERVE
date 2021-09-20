/**
 * Represents an entity while it is being passed between
 * engine, server, and client.
 */
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
  gameData: any; //Holds extra information
  update(): void;
}
