import "./index.less";
import { NerveClient } from "nerve-client";
import { DemoClientInputHandler } from "./DemoClientInputHandler";

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
  let username: string;
  $("#username")?.addEventListener("keyup", async (e) => {
    const overlay = $("#overlay") as HTMLDivElement;
    const evt = e as KeyboardEvent;
    if (evt.key === "Enter" && overlay) {
      overlay.style.display = "none";
      username = ($("#username") as HTMLInputElement).innerText;

      // Connect to server and start client's ticker only after username has been entered
      client.disableInput = false;
      await client.attachToServer();
      client.pixi.ticker.start();
    }
  });
}());
