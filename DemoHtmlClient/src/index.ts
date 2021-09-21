import "./index.less";
import * as PIXI from "pixi.js";
import { ClientEntity, NerveClient } from "nerve-client";
import { DemoClientInputHandler } from "./DemoClientInputHandler";
import { Viewport } from "pixi-viewport";

// A way to translate the keys of the debug object to human readable text
type FieldLocalizations = {
  [key: string]: string
}

// Async IIFE wraps all demo code to prevent it from polluting the global scope
(async function start() {
  // Convenience function to look up DOM elements
  const $ = (x: string) => document.querySelector(x);

  // Create NerveClient
  const client = new NerveClient(new DemoClientInputHandler());
  client.attachEventListenersTo(document);
  client.disableInput = true;

  // Resize client when window resizes
  window.addEventListener("resize", () => {
    client.pixi.renderer.resize(window.innerWidth, window.innerHeight);
    client.viewport.resize(window.innerWidth, window.innerHeight);
  });

  // Styling so that the client canvas is always full page
  client.pixi.view.style.position = "fixed";
  client.pixi.view.style.width = "100vw";
  client.pixi.view.style.height = "100vh";
  client.pixi.view.style.zIndex = "-5";

  stars(client.viewport, 30, 10);

  // Actually add client canvas to the HTML document
  document.body.appendChild(client.view);

  // Just a lookup dict for translating debug keys to human readable text
  const fieldLocalizations: FieldLocalizations = {
    playerX: "Player X",
    playerY: "Player Y",
    fps: "FPS",
    avgSyncTime: "Average sync time",
    numEntities: "Entities",
  };

  // Everytime the client has a debug update, go through all debug info,
  // translate it to human text, then update the corresponding DOM element.
  client.onDebugUpdate(() => {
    Object.entries(client.debugInfo).forEach(([key, value]) => {
      const elem = $(`#debug-screen p[data-field-${key}]`);
      if (elem) {
        const text = value.toFixed(2);
        elem.textContent = `${fieldLocalizations[key]}: ${text.toString()}`;
      }
    });
  });

  // Username handling
  let username = "";
  let classValue = 0;
  const overlay = $("#overlay") as HTMLDivElement;
  $("#username")?.addEventListener("keyup", async (e) => {
    const evt = e as KeyboardEvent;
    if (evt.key === "Enter" && overlay) {
      // Connect to server and start client's ticker only after username has been entered
      username = ($("#username") as HTMLInputElement).value;
      await connectToServer(overlay, username, client, classValue);
    }
  });

  //Play button handling (Same thing as username handling on enter)
  $("#btn_play")?.addEventListener("click", async (e) => {
    username = ($("#username") as HTMLInputElement).value;
    await connectToServer(overlay, username, client, classValue);
  });

  // Game class handling
  let disabledBtn = $("#btn_A") as HTMLButtonElement;
  $("#btn_A")?.addEventListener("click", (e) => {
    classValue = 0;
    disabledBtn = changeDisabledBtn(disabledBtn, $("#btn_A") as HTMLButtonElement);
    console.log(classValue);
  });
  $("#btn_B")?.addEventListener("click", (e) => {
    classValue = 1;
    disabledBtn = changeDisabledBtn(disabledBtn, $("#btn_B") as HTMLButtonElement);
    console.log(classValue);
  });
  $("#btn_C")?.addEventListener("click", (e) => {
    classValue = 2;
    disabledBtn = changeDisabledBtn(disabledBtn, $("#btn_C") as HTMLButtonElement);
    console.log(classValue);
  });

  //Game music, off until game connects
  const GameMusic = new Audio("../res/test_music.ogg");
  GameMusic.loop = true;

  //All that are currently on the server
  const bullets: Set<number> = new Set();

  //Keep track of all possible shooters and there sounds
  const shooters: Map<number, any> = new Map();

  // Maps names to text
  // Outside of ticker to keep track of deleted entities
  const entitiesToText: Map<number, any> = new Map();

  client.pixi.ticker.add(() => {
    // Maps names to text
    const xOffset = 20;
    const yOffset = 30;
    client.entities.forEach((clientEntity) => {
      // No game data, ignore
      if (!clientEntity.gameData) { return; }

      // Entity exists in our map, must update
      if (entitiesToText.has(clientEntity.id)) {
        const text = entitiesToText.get(clientEntity.id);
        text.text = clientEntity.gameData.name;
        text.x = clientEntity.sprite.x + xOffset;
        text.y = clientEntity.sprite.y - yOffset;
      } else {
        // Entity not in our map but in NerveClient's, must create
        const name = clientEntity.gameData.name as string;
        const text = new PIXI.Text(name, { fontFamily: "Arial", fontSize: 24, fill: "black" });
        text.anchor.set(0.5, 0.5);
        entitiesToText.set(clientEntity.id, text);
        client.viewport.addChild(text);
      }

      //Play sounds for each bullet we have never seen before
      if (!bullets.has(clientEntity.id) && clientEntity.gameData.isBullet) {
        const parentId = clientEntity.gameData.parentId;
        const parent = client.entities.get(parentId);
        const player = client.entities.get(client.clientId);

        //If either parent or player are undefine, do not process that sound
        if (parent === undefined || player === undefined) {
          return;
        }

        //Play different sounds based on who shot the bullet
        if (!shooters.has(parentId)) {
          if (parentId == client.clientId) {
            shooters.set(parentId, new Audio("../res/SFX_shot11.wav"));
            console.log("Added sound for player.");
          } else {
            shooters.set(parentId, new Audio("../res/SFX_shot7.wav"));
            shooters.get(parentId).volume = 0.6;
          }
        }

        //Play shoot sounds
        shooters.get(parentId).play();
        bullets.add(clientEntity.id);
      }
    });

    entitiesToText.forEach((text, id) => {
      // Entity not in NerveClient's map, must delete ours
      if (!client.entities.has(id)) {
        client.viewport.removeChild(text);
        text.destroy();
        entitiesToText.delete(id);
      }
    });

    //Remove bullets and there souunds.
    bullets.forEach((id) =>{
      if (!client.entities.has(id)) {
        bullets.delete(id);
      }
    });
  });

  // Hides the overlay and starts
  async function connectToServer(overlay: HTMLDivElement, username: string, client: NerveClient, classValue: number) {
    //Connect to server
    await client.attachToServer();

    client.server?.onMessage("requestUsername", (message: number) => {
      client.clientId = message;
      //Send the username and class to the server upon successful connection
      client.server?.send("changeNameNClass", JSON.stringify({ player: client.clientId, name: username, classValue: classValue }));
    });

    //Remove overlay and enable inputs
    overlay.style.display = "none";
    client.disableInput = false;

    //Start game music
    GameMusic.play();

    client.pixi.ticker.start();
  }

  //Re-enables the oldBtn and disables the newBtn. Returns the newBtn.
  function changeDisabledBtn(oldBtn: HTMLButtonElement, newBtn: HTMLButtonElement) {
    oldBtn.disabled = false;
    newBtn.disabled = true;

    return newBtn;
  }

  // Stars function taken from pixi-viewport demo
  // https://davidfig.github.io/pixi-viewport/
  function overlap(x: number, y: number, viewport: Viewport, starSize = 30) {
    const size = starSize;
    for (const child of viewport.children) {
      if (x < child.x + size &&
        x + size > child.x &&
        y < child.y + size &&
        y + size > child.y) {
        return true;
      }
    }
    return false;
  }

  function stars(viewport: Viewport, starSize: number, border: number) {
    const stars = (viewport.worldWidth * viewport.worldHeight) / Math.pow(starSize, 2) * 0.1;
    for (let i = 0; i < stars; i++) {
      const star = new PIXI.Sprite(PIXI.Texture.WHITE);
      star.anchor.set(0.5);
      star.tint = randomInt(0xffffff);
      star.width = star.height = starSize;
      star.alpha = range(0.25, 1, true);
      let x, y;
      do {
        x = range(starSize / 2 + border, viewport.worldWidth - starSize - border);
        y = range(border, viewport.worldHeight - border - starSize);
      } while (overlap(x, y, viewport, starSize));
      star.position.set(x, y);
      viewport.addChild(star);
    }
  }

  function randomInt(n: number) {
    return Math.floor(Math.random() * n);
  }

  function randomFloat(n: number) {
    return Math.random() * n;
  }

  function range(start: number, end: number, useFloat = false) {
    // case where there is no range
    if (end === start) {
      return end;
    }

    if (useFloat) {
      return randomFloat(end - start) + start;
    } else {
      let range;
      if (start < 0 && end > 0) {
        range = -start + end + 1;
      } else if (start === 0 && end > 0) {
        range = end + 1;
      } else if (start < 0 && end === 0) {
        range = start - 1;
        start = 1;
      } else if (start < 0 && end < 0) {
        range = end - start - 1;
      } else {
        range = end - start + 1;
      }
      return randomInt(range) + start;
    }
  }

}());
