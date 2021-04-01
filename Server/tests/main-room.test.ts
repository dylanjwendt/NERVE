import { MainRoom } from "../src/main-room";
import { SimpleGameState } from "../src/simple-game-state";

describe("main room", () => {

    it("should update world after receiving new message", () => {
        const room = new MainRoom();
        jest.spyOn(room, "onMessage");
    });

    // it("should update state on new message", () => {
    // });

});