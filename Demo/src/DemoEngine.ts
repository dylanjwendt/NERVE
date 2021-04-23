import { Engine, World, GameLogic, Actor } from "nerve-engine";
import DemoInputHandler from "./DemoInputHandler";
import PlayerActor from "./actors/Player";
import Player from "./actors/Player";
import Bullet from "./actors/Bullet";

export default class DemoEngine extends Engine {
    constructor() {
        super((w: World, l: GameLogic) => new DemoInputHandler(w, l));
    }

    addActor(id: string): void {
        super.addActor(id, new Player(id, "todo"));
        setInterval(() => this.engageBulletHell(this.gameLogic.actors.get(id) as Actor), 5);
    }

    newPlayerActor(name = ""): string {
        const id = this.gameLogic.getValidID();
        const actor = new PlayerActor(id, name);
        this.addActor(actor.getID().toString());
        setInterval(() => this.engageBulletHell(actor), 5);
        return id;
    }

    engageBulletHell(player: Actor) {
        let pos = [Math.random()*2 - 1, Math.random()*2 - 1] as [number, number];
        const id = this.gameLogic.getValidID();
        if(!player) return;
        const pcoords = player.getCoords().toVector();
        pos[0] += pcoords.x;
        pos[1] += pcoords.y;
        const bullet = new Bullet(id, player as Player, [pcoords!.x, pcoords!.y], pos);
        this.gameLogic.addActor(id, bullet);
    }
}

