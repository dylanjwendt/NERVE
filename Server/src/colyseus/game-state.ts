import { Schema, type } from "@colyseus/schema";

/**
 * Represents the state of the game.
 */
export class GameState extends Schema {
    @type("string")
    public text = "";
}
