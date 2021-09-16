import * as PIXI from "pixi.js";
import { Sprite, Texture } from "pixi.js";
import { Application } from "@pixi/app";
import { GameState, NerveServerCommon } from "nerve-server";
import { IEntity } from "@nerve-common/IEntity";
import { ClientEntity } from "./ClientEntity";
import { InputHandler, AcceptedInputHandlers } from "./InputHandler";
import { DefaultInputHandler } from "./DefaultInputHandler";
import type { InputHandlerFunction } from "./InputHandler";

// keep rolling average of this many sync times
const syncTimesWindow = 5;

export type DebugInfo = {
  fps: number,
  numEntities: number,
  playerX: number,
  playerY: number,
  avgSyncTime: number,
}

/**
 * Nerve client for interfacing with the server.
 * 
 * You would only use this class if you are writing a custom client.
 */
export class NerveClient {
  clientId: number
  debugInfo: DebugInfo
  #debugCallback: (() => void) | undefined
  disableInput: boolean
  entities: Map<number, ClientEntity>
  handler: InputHandler
  lastSync: number
  pixi: Application
  server: NerveServerCommon | undefined
  syncTimes: number[] // rolling average of sync times
  tickers: (() => void)[]
  view: HTMLCanvasElement

  constructor(handler?: InputHandler) {
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

    this.clientId = 0;
    this.disableInput = false;
    this.entities = new Map<number, ClientEntity>();
    this.handler = handler || new DefaultInputHandler();
    this.lastSync = 0;
    this.syncTimes = [0];
    this.tickers = [];
    this.view = this.pixi.view;

    this.#setupDefaultTickers();
  }

  async attachToServer(): Promise<void> {
    this.server = new NerveServerCommon();
    await this.server.connect("ws://localhost:2567");
    this.server.onStateChange((state: GameState) => this.#syncServerState(state));
    this.server.onMessage("getPlayerId", (message: number) => {
      this.clientId = message;
      this.handler.setClientId(this.clientId);
    });
  }

  attachEventListenersTo(target: Document | Element | Window): void {
    for (const type of AcceptedInputHandlers) {
      this.#addEventListener(target, type);
    }
  }

  onDebugUpdate(callback: () => void): void {
    this.#debugCallback = callback;
  }

  #addEventListener(target: Document | Element | Window, type: InputHandlerFunction): void {
    target.addEventListener(type, (e) => {
      if (this.disableInput) { return; }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = this.handler[type](e as any);
      if (Array.isArray(data)) {
        this.server?.send(data[0], data[1]);
      } else if (typeof data == "string") {
        this.server?.send(type, data);
      }
    });
  }

  #setupDefaultTickers(): void {
    this.pixi.ticker.add(() => {
      const player = this.entities.get(this.clientId);
      this.debugInfo = {
        fps: this.pixi.ticker.FPS,
        numEntities: this.entities.size,
        playerX: player ? player.sprite.x : -1,
        playerY: player ? player.sprite.y : -1,
        avgSyncTime: this.syncTimes.reduce((acc, cur) => acc + cur, 0) / this.syncTimes.length,
      };

      if (this.#debugCallback) {
        this.#debugCallback();
      }
    });

    this.pixi.ticker.add(() => {
      this.entities.forEach((entity) => {
        this.pixi.renderer.render(entity.sprite);
      });
    });

    // Client side prediction
    this.pixi.ticker.add(() => {
      this.entities.forEach((entity) => entity.update());
    });

    this.pixi.ticker.stop();
  }

  #syncServerState(state: GameState): void {
    // keep rolling average of sync times
    this.syncTimes.push(Date.now() - this.lastSync);
    if (this.syncTimes.length > syncTimesWindow) { this.syncTimes.shift(); }
    this.lastSync = Date.now();

    // sync new entities
    const entityList: IEntity[] = JSON.parse(state.text);
    entityList.forEach((e) => {
      if (this.entities.has(e.id)) {
        const entity = this.entities.get(e.id);
        if (entity) {
          entity.sprite.x = e.x - e.width / 2;
          entity.sprite.y = e.y - e.height / 2;
          entity.vx = e.vx;
          entity.vy = e.vy;
          entity.sprite.tint = e.tint;
          this.entities.set(e.id, entity);
        }
      } else {
        const newSprite = new Sprite(Texture.from("../res/circle.png"));
        newSprite.scale.set(e.scale[0], e.scale[1]);
        newSprite.tint = e.tint;
        newSprite.x = e.x - e.width / 2;
        newSprite.y = e.y - e.height / 2;
        this.entities.set(e.id, new ClientEntity(e.vx, e.vy, newSprite));
        this.pixi.stage.addChild(newSprite);
      }
    });

    // prune removed entities
    this.entities.forEach((entity, id) => {
      if (!entityList.find((e) => e.id === id)) {
        this.entities.delete(id);
        this.pixi.stage.removeChild(entity.sprite);
      }
    });
  }
}
