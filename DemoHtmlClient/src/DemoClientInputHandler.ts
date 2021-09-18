import { DefaultInputHandler } from "nerve-client";
import type { InputHandlerReturnType } from "nerve-client";

/**
 * This is the input handler for the demo client. It extends DefaultInputHandler
 * so it can retain most of the default behavior. The only custom behavior is an
 * additional check for the "t" input, which simulates a laser of bullets by 
 * essentially autoclicking.
 */
export class DemoClientInputHandler extends DefaultInputHandler {
  keydown(e: KeyboardEvent): InputHandlerReturnType {
    // Keep the debouncing behavior that DefaultInputHandler has
    // for keys like w,a,s,d
    if (!this.keysDown.has(e.key)) {
      this.keysDown.add(e.key);
      return { key: e.key };
    }

    // Special behavior: if key is "t", then fake a mousedown input
    // This amounts to autoclicking
    if (e.key === "t") {
      return ["mousedown", { mousePos: this.mousePos }];
    }

    // Otherwise don't send data back to the server
    return null;
  }
}