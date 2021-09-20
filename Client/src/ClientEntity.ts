import { Sprite } from "pixi.js";
import { NerveConfig } from "nerve-common";

const smoothing = NerveConfig.client.smoothing;

/**
 * Simple entity data class for client-side prediction
 */
export class ClientEntity {
  id: number;
  vx: number;
  vy: number;
  sprite: Sprite;
  gameData: any; //Holds extra game data

  constructor(id: number, vx: number, vy: number, sprite: Sprite, gameData: any) {
    this.id = id;
    this.vx = vx;
    this.vy = vy;
    this.sprite = sprite;
    this.gameData = gameData;
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
