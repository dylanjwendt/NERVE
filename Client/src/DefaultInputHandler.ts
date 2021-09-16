import { InputHandler } from "./InputHandler"
import type { InputHandlerReturnType } from "./InputHandler"

/**
 * The default input handler for the client, which just propagates input
 * down to the server and also handles debouncing held down keys.
 */
export class DefaultInputHandler extends InputHandler {
  keyup(e: KeyboardEvent): InputHandlerReturnType {
    this.keysDown.delete(e.key);
    return JSON.stringify({ player: this.clientId, key: e.key });
  }

  keypress(e: KeyboardEvent): InputHandlerReturnType {
    return JSON.stringify({ player: this.clientId, key: e.key });
  }

  keydown(e: KeyboardEvent): InputHandlerReturnType {
    if (!this.keysDown.has(e.key)) {
      this.keysDown.add(e.key);
      return JSON.stringify({ player: this.clientId, key: e.key });
    }
    return null
  }

  mousemove(e: MouseEvent): InputHandlerReturnType {
    this.mousePos = [e.clientX, e.clientY]
    return null
  }

  mouseup(e: MouseEvent): InputHandlerReturnType {
    return JSON.stringify({ player: this.clientId, mousePos: this.mousePos });
  }

  mousedown(e: MouseEvent): InputHandlerReturnType {
    return JSON.stringify({ player: this.clientId, mousePos: this.mousePos });
  }
}
