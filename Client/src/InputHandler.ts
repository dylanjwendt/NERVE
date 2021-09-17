import { Viewport } from "pixi-viewport";

export const AcceptedInputHandlers = ["keyup", "keypress", "keydown", "mouseup", "mousemove", "mousedown"] as const;
export type InputHandlerFunction = typeof AcceptedInputHandlers[number]
export type InputHandlerReturnType = string | [InputHandlerFunction, string] | null

/**
 * Represents an input handler for the client.
 * 
 * All methods should return the stringified data to send to the server,
 * or null if no data should be sent.
 * 
 * These event listeners are attached via the {@link NerveClient.attachEventListenersTo} method.
 */
export abstract class InputHandler {
  clientId: number
  keysDown: Set<string>
  mousePos: [number, number]

  /**
   * The viewport of the nerve client. The NerveClient constructor will set this for you.
   * 
   * This should probably be used to compute mouse offsets (e.g. event.clientX + this.viewport.left)
   * so that mouse input is relative to the world and not the screen.
   * 
   * The InputHandler should NOT use the viewport for rendering, instead access the viewport through
   * the {@link NerveClient.viewport}.
   */
  viewport: Viewport | undefined

  constructor() {
    this.keysDown = new Set<string>();
    this.mousePos = [0, 0];
    this.clientId = 0;
  }

  setClientId(clientId: number): void {
    this.clientId = clientId;
  }

  /**
   * Fired when the target element fires a keyup event.
   * 
   * You should remember to delete the key from {@link InputHandler.keysDown}
   * so that keydown can fire for the key again.
   * @param e KeyboardEvent
   * @returns Serialized data to send to server
   */
  abstract keyup(e: KeyboardEvent): InputHandlerReturnType

  abstract keypress(e: KeyboardEvent): InputHandlerReturnType

  /**
   * Fired when the target element fires a keydown event.
   * 
   * You should probably make use of {@link InputHandler.keysDown} to debounce the input,
   * otherwise you will be spamming the server whenever someone holds down a key.
   * @param e KeyboardEvent
   * @returns Serialized data to send to server
   */
  abstract keydown(e: KeyboardEvent): InputHandlerReturnType

  abstract mousemove(e: MouseEvent): InputHandlerReturnType

  abstract mouseup(e: MouseEvent): InputHandlerReturnType

  abstract mousedown(e: MouseEvent): InputHandlerReturnType
  
  setViewport(viewport: Viewport): void {
    this.viewport = viewport;
  }
}
