import { Schema, type } from "@colyseus/schema";

export class SimpleGameState extends Schema {
    @type("string")
    public text = "";
}
