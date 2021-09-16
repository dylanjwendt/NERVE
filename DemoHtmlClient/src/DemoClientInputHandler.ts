import { DefaultInputHandler } from "nerve-client";
import type { InputHandlerReturnType } from "nerve-client"

export class DemoClientInputHandler extends DefaultInputHandler {
  keydown(e: KeyboardEvent): InputHandlerReturnType {
    if (!this.keysDown.has(e.key)) {
      this.keysDown.add(e.key);
      return JSON.stringify({ player: this.clientId, key: e.key });
    }

    if (e.key === 't') {
      return ["mousedown", JSON.stringify({ player: this.clientId, mousePos: this.mousePos })];
    }

    return null
  }
}