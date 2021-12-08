/**
 * Represents an entity while it is being passed between
 * engine, server, and client.
 */
export interface IEntity {
  /** The id of the entity*/
  id: number;
  /** The x position of the entity in the world*/
  x: number;
  /** The y position of the entity in the world*/
  y: number;
  /** The visual x position of the entity in the world*/
  vx: number;
  /** The visual y position of the entity in the world*/
  vy: number;
  /** The entity's scale of it's width and height*/
  scale: [number, number];
  /** The tint of the entity*/
  tint: number;  // hexadecimal
  /** The width of the entity*/
  width: number;
  /** The height of the entity*/
  height: number;
  /** The texture or sprite of the entity*/
  texture: string;  
  /** The client side prediction function for the entity*/
  update(): void;
  
  /** Holds any extra game data the entity comes with*/
  // eslint-disable-next-line
  gameData: any;
}
