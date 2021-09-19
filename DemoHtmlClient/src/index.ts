import "./index.less";
import * as PIXI from "pixi.js";
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
    disabledBtn = changeDisabledBtn(disabledBtn, $("#btn_A")  as HTMLButtonElement);
    console.log(classValue);
  });
  $("#btn_B")?.addEventListener("click", (e) => {
    classValue = 1;
    disabledBtn = changeDisabledBtn(disabledBtn, $("#btn_B")  as HTMLButtonElement);
    console.log(classValue);
  });
  $("#btn_C")?.addEventListener("click", (e) => {
    classValue = 2;
    disabledBtn = changeDisabledBtn(disabledBtn, $("#btn_C")  as HTMLButtonElement);
    console.log(classValue);
  });

  //Render username
  const text = new PIXI.Text(username, {fontFamily: "Arial", fontSize: 24, fill : "black"});
  text.anchor.set(0.5, 0.5);
  client.viewport.addChild(text);

  client.pixi.ticker.add(() => {
    const xOffset = 20;
    const yOffset = 30;
    const player = client.entities.get(client.clientId);
    if (player == undefined){
      return;
    }
    text.text = username;
    text.x = player.sprite.x + xOffset;
    text.y = player.sprite.y - yOffset;
    console.log("Rendering text at  (" + text.x + ", " + text.y + ") with color \"" + text.style.fill?.toString() + "\" with value \"" + username + "\"");
    text.updateText(true);
  });
}());

//Hides the overlay and starts
async function connectToServer(overlay : HTMLDivElement, username : string, client : NerveClient, classValue : number) {
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
  
  client.pixi.ticker.start();
}

//Re-enables the oldBtn and disables the newBtn. Returns the newBtn.
function changeDisabledBtn(oldBtn : HTMLButtonElement, newBtn : HTMLButtonElement) {
  oldBtn.disabled = false;
  newBtn.disabled = true;

  return newBtn;
}
