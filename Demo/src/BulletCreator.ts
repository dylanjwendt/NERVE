import { GameLogic } from "nerve-engine";
import Bullet from "./actors/Bullet";
import DemoEngine from "./DemoEngine";
import Player from "./actors/Player";

export class BulletCreator {
    private engine: DemoEngine;
    private logic: GameLogic;

    constructor(engine: DemoEngine, logic: GameLogic) {
        this.engine = engine;
        this.logic = logic;
    }

    /**
     * Spawns a bullet with the given vector, defined by two points
     * @param owner Owner of this bullet, or null
     * @param pos1 starting x,y position
     * @param pos2 ending x,y position
     */
    singleDirect(owner: Player | null, pos1: [number, number], pos2: [number, number], tint?: number): void {
        const id = this.logic.getValidID();
        const bullet = new Bullet(id, owner, pos1, pos2, this.engine!.engine, this.logic, this.engine!);
        if (tint != undefined) { bullet.setTint(tint); }
        this.logic.addActor(id, bullet);
    }

    /**
     * Spawns a N bullets evenly spaced around the owner
     * @param owner Owner of the bullets
     * @param num Number of the bullets
     * @param tint Tint of the bullets
     */
    circleOfN(owner: Player, num: number, tint?: number): void {
        const bhPos = [owner.body.position.x, owner.body.position.y] as [number, number];
        for(let i = 0; i < num; i++) {
            const theta = ((360/num)*i)*Math.PI/180;
            const pos = [bhPos[0] + Math.cos(theta), bhPos[1] + Math.sin(theta)] as [number, number];

            const bullet = new Bullet(this.engine.gameLogic.getValidID(), owner, bhPos, pos, this.engine.engine, this.engine.gameLogic, this.engine);
            if (tint != undefined) { bullet.setTint(tint); }
            this.engine.addActor(bullet.body.id, bullet);
        }
    }

    /**
     * Fire a spread of bullets in a cone with the given angle, towards the given target
     * @param owner Owner of the bullets
     * @param num Number of the bullets
     * @param direction The direction
     * @param angle The cone's angle of spread (in DEGREES)
     * @param tint Tint of the bullets
     */
    coneOfN(owner: Player, num: number, target: [number, number], angle: number, offset = 0, tint?: number): void {
        const startPos = [owner.body.position.x, owner.body.position.y] as [number, number];
        for(let i = 0; i < num; i++) {
            let theta = ((angle/num)*i) * Math.PI/180 - 0.5*angle*Math.PI/180;
            theta += Math.atan2(startPos[1] - target[1], startPos[0] - target[0]);
            theta += offset*Math.PI/180;
            const pos = [startPos[0] - Math.cos(theta), startPos[1] - Math.sin(theta)] as [number, number];

            const bullet = new Bullet(this.engine.gameLogic.getValidID(), owner, startPos, pos, this.engine.engine, this.engine.gameLogic, this.engine);
            if (tint != undefined) { bullet.setTint(tint); }
            this.engine.addActor(bullet.body.id, bullet);
        }
    }
}
