import { ArraySchema, Schema, type } from "@colyseus/schema";

export class GameState extends Schema {
    @type(["string"])
    public messages = new ArraySchema<string>();

    @type(["string"])
    public players = new ArraySchema<string>();
}
