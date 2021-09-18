import { Engine, GameLogic} from "nerve-engine";
import DemoInputHandler from "./DemoInputHandler";
import Player from "./actors/Player";
import Blackhole from "./actors/Blackhole";
import Matter from "matter-js";
import { BotPlayer } from "./actors/BotPlayer";

const numBlackholes = 10;

export default class DemoEngine extends Engine {
    blackholes: Blackhole[];
    bots: BotPlayer[];
    playerBotOwners: Map<number, number[]>;  // tracks which bots were added for each player that joined 
    numBotsPerPlayer = 70;  // can be whatever we want

    constructor() {
        super((l: GameLogic) => new DemoInputHandler(l));
        this.blackholes = [];

        for(let i = 0; i < numBlackholes; i++) {
            const x = Math.floor(Math.random() * 1000);
            const y = Math.floor(Math.random() * 1000);
            const vx = Math.floor(Math.random() * 1000);
            const vy = Math.floor(Math.random() * 1000);
            const bh = new Blackhole(this.gameLogic.getValidID(), `bh${i}`, this);
            bh.setOrigin([x, y]);
            Matter.Body.setPosition(bh.body, Matter.Vector.create(vx, vy));
            this.gameLogic.addActor(bh.getID(), bh);
            this.blackholes[i] = bh;
        }

        (this.inputHandler as DemoInputHandler).setEngine(this);
        this.bots = new Array<BotPlayer>();
        this.playerBotOwners = new Map<number, number[]>();
    }

    update(millisec: number): void {
        this.blackholes.forEach(bh => bh.wander(millisec));
        this.bots.forEach(bot => bot.update());
        super.update(millisec);
    }

    addPlayerActor(playerId: number): void {
        super.addActor(playerId, new Player(playerId, this, "todo"));
        this.addBotsForPlayer(playerId);
    }

    private addBotsForPlayer(playerId: number): void {
        const botsForPlayer = new Array<number>();
        for (let i = 0; i < this.numBotsPerPlayer; i++) {
            const botId = this.getValidId();
            const bot = new BotPlayer(botId, this, "name");
            this.bots.push(bot);
            botsForPlayer.push(botId);
            super.addActor(botId, bot);
        }
        this.playerBotOwners.set(playerId, botsForPlayer);
    }

    removeActor(id: number): void {
        this.removeBots(id);
        super.removeActor(id);
    }

    private removeBots(playerId: number): void {
        // if a player left, we will also remove the bots that joined for them
        if (this.playerBotOwners.has(playerId)) {
            const botsToRemove = this.playerBotOwners.get(playerId);
            botsToRemove?.forEach(botId => super.removeActor(botId));
            this.playerBotOwners.delete(playerId);
        }
    }

    getValidId(): number {
        return this.gameLogic.getValidID();
    }
}

