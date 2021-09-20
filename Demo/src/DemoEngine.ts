import { Actor, Engine, GameLogic} from "nerve-engine";
import DemoInputHandler from "./DemoInputHandler";
import Player from "./actors/Player";
import Blackhole from "./actors/Blackhole";
import { Body, Vector} from "matter-js";
import { BotPlayer } from "./actors/BotPlayer";
import { IEntity } from "nerve-common";

export default class DemoEngine extends Engine {
    bh: Blackhole;
    bh2: Blackhole;
    bots: BotPlayer[];
    playerBotOwners: Map<number, number[]>;  // tracks which bots were added for each player that joined 
    numBotsPerPlayer = 2;  // can be whatever we want

    constructor() {
        super((l: GameLogic) => new DemoInputHandler(l));
        this.bh = new Blackhole(this.gameLogic.getValidID(), "bh1", this);
        Body.setPosition(this.bh.body, Vector.create(500, 500));

        this.bh.setOrigin([500, 500]);
        this.gameLogic.addActor(this.bh.getID(), this.bh);

        this.bh2 = new Blackhole(this.gameLogic.getValidID(), "bh2", this);
        Body.setPosition(this.bh2.body, Vector.create(1000, 1000));

        this.bh2.setOrigin([500, 500]);
        this.gameLogic.addActor(this.bh2.getID(), this.bh2);

        (this.inputHandler as DemoInputHandler).setEngine(this);
        this.bots = new Array<BotPlayer>();
        this.playerBotOwners = new Map<number, number[]>();
    }

    update(millisec: number): void {
        this.bh.wander(millisec);
        this.bh2.wander(millisec);
        this.bots.forEach(bot => bot.update());
        super.update(millisec);
    }

    addPlayerActor(playerId: number): void {
        super.addActor(playerId, new Player(playerId, this, ""));
        this.addBotsForPlayer(playerId);
    }

    private addBotsForPlayer(playerId: number): void {
        const botsForPlayer = new Array<number>();
        for (let i = 0; i < this.numBotsPerPlayer; i++) {
            const botId = this.getValidId();
            const bot = new BotPlayer(botId, this, "bot" + botId);
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

    changeUsernameAndClass(playerId: number, newName: string, newClass : number): void {
        const player = (this.gameLogic.actors.get(playerId) as Player);
        player.setName(newName);
        player.changeClass(newClass);
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

    culling(): void {
        //When culling is implemented, do not cull players.
        //Bind them to real world
        // if dead, do not bind. Let them be.
    }
}
