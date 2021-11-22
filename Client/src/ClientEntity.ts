import { Sprite } from "pixi.js";
import { NerveConfig } from "nerve-common";

/** Smoothing for the client side prediction */
const smoothing = NerveConfig.client.smoothing;

/**
 * Represents a simple entity given an id, position, sprite, and gameData.
 * Useful for storing information about an entity.
 * Very helpful for client-side prediction.
 */
export class ClientEntity {
  /** Id of the entity */
  id: number;
  /** Visual x position of the entity */
  vx: number;
  /** Visual y position of the entity */
  vy: number;
  /** Sprite of the entity */
  sprite: Sprite;
  /** If the entity has a texture or not */
  hasTexture: boolean;

  /** Holds extra information on the entity */
  gameData: any; // eslint-disable-line

  /**
   * Creates a new Client Entity.
   * 
   * @param id - Id of the entity
   * @param vx - Visual x position of the entity
   * @param vy - Visual y position of the entity
   * @param sprite - Sprite of the entity
   * @param gameData - Extra information on the entity
   * @param hasTexture - If the entity has a texture or not, false by default.
   */
  // eslint-disable-next-line
  constructor(id: number, vx: number, vy: number, sprite: Sprite, gameData: any, hasTexture = false) {
    this.id = id;
    this.vx = vx;
    this.vy = vy;
    this.sprite = sprite;
    this.gameData = gameData;
    this.hasTexture = hasTexture;
  }

  /**
   * Simple prediction update which just moves each entity's sprite along
   * its previous velocity vector by a small amount.
   * 
   * This amount can be controlled by the "client.smoothing" field in
   * the top-level nerve.config.json.
   */
  update(): void {
    let normalization = Math.sqrt(this.vx ** 2 + this.vy ** 2);
    normalization = normalization === 0 ? 1 : normalization;

    this.sprite.x += (this.vx / normalization) * smoothing;
    this.sprite.y -= (this.vy / normalization) * smoothing; // subtract because origin in top-left
  }
}
