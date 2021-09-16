/**
 * Top-level client exports
 * You can use these if you want to write a custom client,
 * for example, in order to use a different front-end framework.
 */

export { ClientEntity } from "./ClientEntity";
export { NerveClient } from "./NerveClient";
export { DefaultInputHandler } from "./DefaultInputHandler";
export { InputHandler, AcceptedInputHandlers } from "./InputHandler";
export type { InputHandlerReturnType, InputHandlerFunction } from "./InputHandler";
export type { DebugInfo } from "./NerveClient";
