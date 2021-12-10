import { NerveConfig } from "nerve-common";
import { BulletCreator } from "../BulletCreator";
import BotPlayer from "../actors/BotPlayer";
import DemoEngine from "../DemoEngine";

/**
 * Bot with variant behavior: shoots an exploding ring of bullets
 */
export default class ExplodingBot extends BotPlayer {
    private bulletPatterns: BulletCreator;

    constructor(id: number, engine: DemoEngine, name = "") {
        super(id, engine, name);
        this.bulletPatterns = engine.bulletCreator;
        this.MAX_SHOOTING_STEPS = 4;
        this.SHOOTING_FREQ = 0.004;
        this.texture = "explosion_bot.png";
    }

    public update(): void {
        this.moveRandomly();
        this.shootRandomly();
        //this.spawnWallRandomly();
    }

    #shoot(): void {
        if (this.isShooting) {
            const offset = this.shootingStepsTaken / this.SHOOTING_INTERVAL;
            this.bulletPatterns.coneOfN(this, NerveConfig.demo.explodingBotBulletCount, this.chooseRandomMousePos(),
                360, offset, 0x22ee22);
        }
    }

    protected continueShooting(): void {
        // do modulo division to check if it's been x many updates since the last time we shot
        if (this.shootingStepsTaken % this.SHOOTING_INTERVAL === 0) {
            this.#shoot();
        }
        this.shootingStepsTaken++;
    }

    /**
     * Shoot in random direction at random intervals.
     */
    protected shootRandomly(): void {
        if (this.isShooting) {
            if (this.shootingStepsTaken > (this.shootingStepsCap * this.SHOOTING_INTERVAL)) {
                this.stopShooting();
            }
            this.continueShooting();
        }
        else {
            // there's a 0.5% chance the bot will decide to start shooting.
            // this is checked _every_ tick of the server, so 0.5% is frequent enough
            if (Math.random() < this.SHOOTING_FREQ) {
                this.startShooting();
            }
        } 
    }
}
