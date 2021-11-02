import { Body, Vector, Composite, Bodies } from "matter-js";
import { Engine, GameLogic} from "nerve-engine";
import { NerveConfig } from "nerve-common";
import DemoInputHandler from "./DemoInputHandler";
import Player from "./actors/Player";
import Blackhole from "./actors/Blackhole";
import BotPlayer from "./actors/BotPlayer";

const numBlackholes = NerveConfig.engine.numBlackHoles;

export default class DemoEngine extends Engine {
    blackholes: Blackhole[];
    bots: BotPlayer[];
    playerBotOwners: Map<number, number[]>;  // tracks which bots were added for each player that joined 
    numBotsPerPlayer = NerveConfig.engine.numBotsPerPlayer;  

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
            Body.setPosition(bh.body, Vector.create(vx, vy));
            this.addActor(bh.getID(), bh);
            this.blackholes[i] = bh;
        }

        (this.inputHandler as DemoInputHandler).setEngine(this);
        this.bots = new Array<BotPlayer>();
        this.playerBotOwners = new Map<number, number[]>();

        // Create world border walls
        const { worldWidth, worldHeight } = NerveConfig.engine;
        const wallThickness = 100;
        const wallOpts = {
            isStatic: true,
            collisionFilter: {
                mask: -1,
                category: -1
            }
        };
        Composite.add(this.engine.world, [
            Bodies.rectangle(worldWidth / 2, -wallThickness/2, worldWidth, wallThickness, wallOpts),
            Bodies.rectangle(worldWidth / 2, worldHeight + wallThickness/2, worldWidth, wallThickness, wallOpts),
            Bodies.rectangle(-wallThickness/2, worldHeight / 2, wallThickness, worldHeight, wallOpts),
            Bodies.rectangle(worldHeight + wallThickness/2, worldHeight / 2, wallThickness, worldHeight, wallOpts)
        ]);
    }

    /**
     * Move engine forward by provided delta Time
     * @param millisec Duration since last update
     */
    update(millisec: number): void {
        this.blackholes.forEach(bh => bh.wander(millisec));
        this.bots.forEach(bot => bot.update());
        super.update(millisec);
    }

    /**
     * Add a new player actor to the game
     * @param playerId Numeric ID Value of player. Only use the getValidID() function of engine to get values for this.
     */
    addPlayerActor(playerId: number): void {
        super.addActor(playerId, new Player(playerId, this, ""));
        this.addBotsForPlayer(playerId);
    }

    /**
     * Number of bots is set by increasing number of players.
     * @param playerId ID of creating player
     */
    private addBotsForPlayer(playerId: number): void {
        const botsForPlayer = new Array<number>();
        for (let i = 0; i < this.numBotsPerPlayer; i++) {
            const botId = this.getValidId();
            const bot = new BotPlayer(botId, this, "bot" + botId);
            const { worldWidth, worldHeight } = NerveConfig.engine;
            Body.setPosition(bot.body, Vector.create(Math.floor(Math.random() * worldWidth), Math.floor(Math.random() * worldHeight)));
            this.bots.push(bot);
            botsForPlayer.push(botId);
            super.addActor(botId, bot);
        }
        this.playerBotOwners.set(playerId, botsForPlayer);
    }

    /**
     * Remove an actor from the engine by ID.
     * @param id ID of actor to remove
     */
    removeActor(id: number): void {
        this.removeBots(id);
        super.removeActor(id);
    }

    /**
     * 
     * @param playerId ID of player being changed
     * @param newName New name of player
     * @param newClass New class value of player
     */
    changeUsernameAndClass(playerId: number, newName: string, newClass : number): void {
        const player = (this.gameLogic.actors.get(playerId) as Player);
        player.setName(newName);
        player.changeClass(newClass);
    }

    /**
     * If a player left, we will also remove the bots that joined for them
     * @param playerId ID of leaving player
     */
    private removeBots(playerId: number): void {
        if (this.playerBotOwners.has(playerId)) {
            const botsToRemove = this.playerBotOwners.get(playerId);
            botsToRemove?.forEach(botId => super.removeActor(botId));
            this.playerBotOwners.delete(playerId);
        }
    }

    /**
     * returns the number of human players and bots entities currently in game
     */
    getPlayerCount(): number {
        let count = 0;
        this.gameLogic.actors.forEach((actor) => {
            if (actor instanceof Player || actor instanceof BotPlayer) {
                count++;
            }
        });
        return count;
    }

    /**
     * Polls the gameLogic for a new valid ID
     * @returns Valid Numeric ID
     */
    getValidId(): number {
        return this.gameLogic.getValidID();
    }

    culling(): void {
        //When culling is implemented, do not cull players.
        //Bind them to real world
        // if dead, do not bind. Let them be.
    }
}
