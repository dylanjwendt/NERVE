import { Viewport } from "pixi-viewport";

/** What input handlers are accepted by the program. */
export const AcceptedInputHandlers = ["keyup", "keypress", "keydown", "mouseup", "mousemove", "mousedown"] as const;

/** equivalent to a union type of the strings in AcceptedInputHandlers */
export type InputHandlerFunction = typeof AcceptedInputHandlers[number]
/**
 * One of:
 * 
 * (1) an object of data to be sent to the server
 * 
 * (2) a tuple [type, data] to send data back to the server under "type".
 * For example, to send a mousedown from the keydown handler you could return ["mousedown", { data }]
 * 
 * (3) null to not send anything to the server
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type InputHandlerReturnType = {[key: string]: any} | [InputHandlerFunction, {[key: string]: any}] | null

/**
 * Represents an input handler for the client.
 * 
 * All handlers should return either
 * (1) an object of data to be sent back to the server,
 * (2) a tuple [eventType, data] in case you want to send the data back through a different channel;
 * for example, sending a mousedown event from the keydown handler,
 * or (3) null to not send anything to the server.
 * 
 * If you return data objects, then NerveClient will automatically attach the clientId for you.
 * 
 * These event listeners are attached via the {@link NerveClient.attachEventListenersTo} method.
 */
export abstract class InputHandler {
  /** A set for tracking keys being held down. See {@link DefaultInputHandler} for example usage. */
  keysDown: Set<string>
  /** Tuple of mouse (x, y) */
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
  }

  /**
   * Fired when the target element fires a keyup event.
   * 
   * You should remember to delete the key from {@link InputHandler.keysDown}
   * so that keydown can fire for the key again.
   * @param e KeyboardEvent
   * @returns Data to send to server, or null
   */
  abstract keyup(e: KeyboardEvent): InputHandlerReturnType

  /**
   * Fired when the target element fires a keypress event.
   * 
   * @param e KeyboardEvent
   * @returns Data to send to server, or null
   */
  abstract keypress(e: KeyboardEvent): InputHandlerReturnType

  /**
   * Fired when the target element fires a keydown event.
   * 
   * You should probably make use of {@link InputHandler.keysDown} to debounce the input,
   * otherwise you will be spamming the server whenever someone holds down a key.
   * @param e KeyboardEvent
   * @returns Data to send to server, or null
   */
  abstract keydown(e: KeyboardEvent): InputHandlerReturnType

  /**
   * Fired when the target element fires a mousemove event.
   * 
   * @param e MouseEvent
   */
  abstract mousemove(e: MouseEvent): InputHandlerReturnType

  /**
   * Fired when the target element fires a mouseup event.
   * 
   * @param e MouseEvent
   */
  abstract mouseup(e: MouseEvent): InputHandlerReturnType

  /**
   * Fired when the target element fires a mousedown event.
   * 
   * @param e MouseEvent
   */
  abstract mousedown(e: MouseEvent): InputHandlerReturnType
  
  /**
   * Sets the input handler's reference to the client viewport. Necessary for transforming screen coordinates
   * to in-game world coordinates.
   * 
   * NerveClient will call this for you.
   * @param viewport The viewport
   */
  setViewport(viewport: Viewport): void {
    this.viewport = viewport;
  }
}
