import * as PIXI from "pixi.js";
import { Sprite, Texture } from "pixi.js";
import { Application } from "@pixi/app";
import { Viewport } from "pixi-viewport";
import { Simple } from "pixi-cull";
import { GameState, NerveServerCommon } from "nerve-server";
import { IEntity, NerveConfig } from "nerve-common";
import { ClientEntity } from "./ClientEntity";
import { InputHandler, AcceptedInputHandlers } from "./InputHandler";
import { DefaultInputHandler } from "./DefaultInputHandler";
import type { InputHandlerFunction } from "./InputHandler";

// keep rolling average of this many sync times
const syncTimesWindow = 5;

/**
 * Object containing all debug information the client tracks.
 */
export type DebugInfo = {
  fps: number,
  numEntities: number,
  playerX: number,
  playerY: number,
  /** Average milliseconds for the client to sync to the server. */
  avgSyncTime: number,
}

/**
 * Nerve client for interfacing with the server.
 * 
 * This class handles all the data logic, and you can import it into whatever front-end framework
 * to create an interface for it.
 */
export class NerveClient {
  #cull: Simple
  #debugCallback: (() => void) | undefined
  #syncTimes: number[]

  clientId: number
  debugInfo: DebugInfo

  /** If true, do not send anything returned from input handlers to server */
  disableInput: boolean
  entities: Map<number, ClientEntity>
  inputHandler: InputHandler
  lastSync: number
  pixi: Application
  server: NerveServerCommon | undefined
  view: HTMLCanvasElement
  viewport: Viewport

  /**
   * Constructs a NerveClient.
   * 
   * If inputHandler is not passed in, then the client will use {@link DefaultInputHandler}.
   * @param inputHandler A custom input handler
   */
  constructor(inputHandler?: InputHandler) {
    this.pixi = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      antialias: true,
      backgroundColor: 0xf0f0f0,
      resizeTo: window,
    });

    this.debugInfo = {
      fps: 0,
      numEntities: 0,
      playerX: 0,
      playerY: 0,
      avgSyncTime: 0
    };

    this.viewport = new Viewport({
      worldWidth: NerveConfig.engine.worldWidth,
      worldHeight: NerveConfig.engine.worldHeight,
      passiveWheel: false,
      interaction: this.pixi.renderer.plugins.interaction,
    });

    this.clientId = 0;
    this.#cull = new Simple();
    this.disableInput = false;
    this.entities = new Map<number, ClientEntity>();
    this.inputHandler = inputHandler || new DefaultInputHandler();
    this.lastSync = 0;
    this.#syncTimes = [0];
    this.view = this.pixi.view;

    this.#setupDefaultTickers();

    this.viewport.clamp({
      left: false,
      right: false,
      top: false,
      bottom: false,
      direction: "all",
      underflow: "center",
    });

    this.pixi.stage.addChild(this.viewport);
    this.inputHandler.setViewport(this.viewport);

    this.#cull.addList(this.viewport.children);
    this.#cull.cull(this.viewport.getVisibleBounds());
  }

  /**
   * Attempt to connect this client to the game server. If successful, then the client will
   * begin syncing to the server and will set {@link NerveClient.clientId} to the id returned by the server.
   */
  async attachToServer(): Promise<void> {
    this.server = new NerveServerCommon();
    await this.server.connect("ws://localhost:2567");
    this.server.onStateChange((state: GameState) => this.#syncServerState(state));
    this.server.onMessage("getPlayerId", (message: number) => {
      this.clientId = message;
    });
  }

  /**
   * Adds the event listeners from the input handler to the given target element.
   * @param target The document/element/window you want to add event listeners to.
   */
  attachEventListenersTo(target: Document | Element | Window): void {
    for (const type of AcceptedInputHandlers) {
      this.#addEventListener(target, type);
    }
  }

  /**
   * Called everytime the client updates its debug information.
   * 
   * This function acts more like a notification, your callback should look into {@link NerveClient.debugInfo}
   * to actually read the updated information.
   * @param callback Callback function
   */
  onDebugUpdate(callback: () => void): void {
    this.#debugCallback = callback;
  }

  #addEventListener(target: Document | Element | Window, type: InputHandlerFunction): void {
    target.addEventListener(type, (e) => {
      if (this.disableInput) { return; }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = this.inputHandler[type](e as any);
      if (Array.isArray(data)) {
        this.server?.send(data[0], JSON.stringify({...data[1], player: this.clientId}));
      } else if (data != null) {
        this.server?.send(type, JSON.stringify({...data, player: this.clientId}));
      }
    });
  }

  #setupDefaultTickers(): void {
    // Update debug information
    this.pixi.ticker.add(() => {
      const player = this.entities.get(this.clientId);
      this.debugInfo = {
        fps: this.pixi.ticker.FPS,
        numEntities: this.entities.size,
        playerX: player ? player.sprite.x : -1,
        playerY: player ? player.sprite.y : -1,
        avgSyncTime: this.#syncTimes.reduce((acc, cur) => acc + cur, 0) / this.#syncTimes.length,
      };

      if (this.#debugCallback) {
        this.#debugCallback();
      }
    });

    // Render entities
    this.pixi.ticker.add(() => {
      this.entities.forEach((entity) => {
        this.pixi.renderer.render(entity.sprite);
      });
    });
    
    // Render viewport
    this.pixi.ticker.add(() => { this.pixi.renderer.render(this.viewport); });

    // Cull whenever the viewport moves
    this.pixi.ticker.add(() => {
      if (this.viewport.dirty) {
        this.#cull.cull(this.viewport.getVisibleBounds());
        this.viewport.dirty = false;
      }
    });

    // Client side prediction
    this.pixi.ticker.add(() => {
      const player = this.entities.get(this.clientId);
      if (!player) { return; }
      this.entities.forEach((entity) => {
        if (entity.sprite.x - player.sprite.x < NerveConfig.client.predictionThreshold &&
            entity.sprite.y - player.sprite.y < NerveConfig.client.predictionThreshold) {
          entity.update();
        }
      });
    });

    // Stop ticker by default, should be started after user inputs username and other game details
    this.pixi.ticker.stop();
  }

  #syncServerState(state: GameState): void {
    // Keep rolling average of sync times
    this.#syncTimes.push(Date.now() - this.lastSync);
    if (this.#syncTimes.length > syncTimesWindow) { this.#syncTimes.shift(); }
    this.lastSync = Date.now();

    // Sync new entities
    const entityList: IEntity[] = JSON.parse(state.text);
    entityList.forEach((e) => {
      if (this.entities.has(e.id)) {
        const entity = this.entities.get(e.id);
        if (entity) {
          entity.sprite.x = e.x - e.width / 2;
          entity.sprite.y = e.y - e.height / 2;
          entity.vx = e.vx;
          entity.vy = e.vy;
          if (entity.hasTexture) {
            entity.sprite.tint = e.tint;
          }
          entity.gameData = e.gameData;
          this.entities.set(e.id, entity);
        }
      } else {
        // Create new entities
        if (!e.texture) {
          let msg = `Entity with id ${e.id} has no texture.`;
          msg += "If it should be invisible, give it an invisible texture.";
          console.error(msg);
          e.texture = "NOTEXTURE.png";
          e.tint = 0xFFFFFF;
        }

        const newSprite = new Sprite(Texture.from("../res/" + e.texture));
        newSprite.scale.set(e.scale[0], e.scale[1]);
        newSprite.tint = e.tint;
        newSprite.x = e.x - e.width / 2;
        newSprite.y = e.y - e.height / 2;
        this.entities.set(e.id, new ClientEntity(e.id, e.vx, e.vy, newSprite, e.gameData, e.texture != "NOTEXTURE.png"));
        this.viewport.addChild(newSprite);
      }

      // Update viewport to follow player
      if(e.id == this.clientId) {
        const player = this.entities.get(e.id);
        if(player) {
          this.viewport.follow(player.sprite, {
            speed: 0,
            acceleration: null,
            radius: null
          });
        }
      }
    });

    // Prune removed entities
    this.entities.forEach((entity, id) => {
      if (!entityList.find((e) => e.id === id)) {
        this.entities.delete(id);
        this.viewport.removeChild(entity.sprite);
        entity.sprite.destroy();
      }
    });
  }
}
