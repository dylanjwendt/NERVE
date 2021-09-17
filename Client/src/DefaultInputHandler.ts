import { InputHandler } from "./InputHandler";
import type { InputHandlerReturnType } from "./InputHandler";

/**
 * The default input handler for the client, which just propagates input
 * down to the server and also handles debouncing held down keys.
 */
export class DefaultInputHandler extends InputHandler {
  /**
   * Fired when NerveClient's target emits a keyup event.
   * 
   * Debounces keys that are being held down to avoid spamming the server by tracking
   * keys in {@link InputHandler.keysDown}.
   * @param e The emitted KeyboardEvent
   * @returns Null if the key is in keysDown, else the key pressed
   */
  keyup(e: KeyboardEvent): InputHandlerReturnType {
    this.keysDown.delete(e.key);
    return { key: e.key };
  }

  /**
   * Fired when NerveClient's target emits a keypress event.
   * 
   * Always sends the key back to server without making use of keysDown.
   * @param e The emitted KeyboardEvent
   * @returns The key pressed
   */
  keypress(e: KeyboardEvent): InputHandlerReturnType {
    return { key: e.key };
  }

  /**
   * Fired when NerveClient's target emits a keydown event.
   * 
   * Debounces keys that are being held down to avoid spamming the server by tracking
   * keys in {@link InputHandler.keysDown}.
   * @param e The emitted KeyboardEvent
   * @returns Null if the key is in keysDown, else the key pressed
   */
  keydown(e: KeyboardEvent): InputHandlerReturnType {
    if (!this.keysDown.has(e.key)) {
      this.keysDown.add(e.key);
      return { key: e.key };
    }
    return null;
  }

  /**
   * Fired when NerveClient's target emits a mousemove event.
   * Simply records the new mouse position plus the viewport offset in {@link InputHandler.mousePos}.
   * 
   * Returns null to avoid sending back to server. If you want to track say, player angle, then you
   * would override this.
   * @param e The emitted MouseEvent
   * @returns null
   */
  mousemove(e: MouseEvent): InputHandlerReturnType {
    let x = 0;
    let y = 0;
    if(this.viewport) {
      x = this.viewport.left;
      y = this.viewport.top;
    }
    this.mousePos = [e.clientX + x, e.clientY + y];
    return null;
  }

  /**
   * Fired when NerveClient's target emits a mouseup event.
   * 
   * @param e The emitted MouseEvent
   * @returns The last recorded mouse position.
   */
  mouseup(e: MouseEvent): InputHandlerReturnType {
    return { mousePos: this.mousePos };
  }

  /**
   * Fired when NerveClient's target emits a mouseup event.
   * 
   * @param e The emitted MouseEvent
   * @returns The last recorded mouse position.
   */
  mousedown(e: MouseEvent): InputHandlerReturnType {
    return { mousePos: this.mousePos };
  }
}
