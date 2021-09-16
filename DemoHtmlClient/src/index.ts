import './index.less'
import { NerveClient } from 'nerve-client'
import { DemoClientInputHandler } from './DemoClientInputHandler';

type FieldLocalizations = {
  [key: string]: string
}

(async function start() {
  const $ = (x: string) => document.querySelector(x);

  const client = new NerveClient(new DemoClientInputHandler());
  await client.attachToServer();
  client.attachEventListenersTo(document);
  client.disableInput = true
  
  window.addEventListener('resize', () => {
    client.pixi.renderer.resize(window.innerWidth, window.innerHeight);
  });
  
  document.body.appendChild(client.pixi.view);
  
  const fieldLocalizations: FieldLocalizations = {
    playerX: "Player X",
    playerY: "Player Y",
    fps: "FPS",
    avgSyncTime: "Average sync time",
    numEntities: "Entities",
  };

  client.onDebugUpdate(() => {
    Object.entries(client.debugInfo).forEach(([key, value]) => {
      const elem = $(`#debug-screen p[data-field-${key}]`);
      if (elem) {
        const text = value.toFixed(2);
        elem.textContent = `${fieldLocalizations[key]}: ${text.toString()}`;
      }
    });
  })

  // Username handling
  let username: string;
  $('#username')?.addEventListener('keyup', (e) => {
    const overlay = $('#overlay') as HTMLDivElement;
    const evt = e as KeyboardEvent;
    if (evt.key === 'Enter' && overlay) {
      overlay.style.display = 'none';
      username = ($('#username') as HTMLInputElement).innerText;
      client.pixi.ticker.start();
      client.disableInput = false
    }
  });
}());
