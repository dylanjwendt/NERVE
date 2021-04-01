import { WorldUpdate } from "../src/world-update";

describe("world update", () => {
    it("should create", () => {
        const worldUpdate = new WorldUpdate();
        expect(worldUpdate).toBeDefined();
    });
});