import Player from "./Player";
import { Engine } from "nerve-engine";
import { NerveConfig } from "nerve-common";

/**
 * this is a simple prototype version of a bot for our demo engine.
 * it extends the Player class (which is an actor) and then 
 * passes random fake data to the engine's input handler.
 * 
 * Bot extends Player because in a .io game bots are supposed to appear just like 
 * players and so they have the same rules/behavior. 
 */
export default class BotPlayer extends Player {

    // the bot maintains a lot of state variables to make "smarter decisions".
    // e.g. moving in the same direction across multiple engine updates rather than 
    // choosing a random direction every tick.

    private isMoving: boolean;
    private movementInput: string;
    private secondMovementInput: string;
    private movementStepsTaken: number;
    private movementStepsCap: number;
    private MIN_MOVEMENT_STEPS = 10;
    private MAX_MOVEMENT_STEPS = 150;
    private SECONDARY_MOVEMENT_FREQ = 0.75;  // 75% chance to have a secondary movement direction

    private isShooting: boolean;
    private shootingStepsTaken: number;
    private shootingStepsCap: number;
    private mousePos: [number, number];
    private SHOOTING_INTERVAL = 12;  // number of updates to wait before firing another bullet
    private MIN_SHOOTING_STEPS = 0;
    private MAX_SHOOTING_STEPS = 10;
    private SHOOTING_FREQ = 0.005;  // there's a 0.5% chance the bot will decide to start shooting 

    private NO_MOVEMENT = "";

    // made up bounds to keep bots within the view of the game, otherwise they will wander away into infinity.
    // this should be changed when the engine has proper world boundaries(?)
    private WORLD_BOUND_X = [0, NerveConfig.engine.worldWidth];
    private WORLD_BOUND_Y = [0, NerveConfig.engine.worldHeight];

    /**
     * 
     * @param id Numeric ID Value of bot. Only use the getValidID() function of engine to get values for this.
     * @param engine Reference to the DemoEngine
     * @param name Name of object for display
     */
    constructor(id: number, engine: Engine, name = "") {
        super(id, engine, name);
        this.movementInput = "";
        this.secondMovementInput = "";
        this.movementStepsTaken = 0;
        this.movementStepsCap = 0;
        this.isMoving = false;
        this.isShooting = false;
        this.shootingStepsTaken = 0;
        this.shootingStepsCap = 0;
        this.mousePos = [0, 0];
    }

    /**
     * Run update-order functions on the bot.
     * called every time the engine updates 
     */ 
    public update(): void {
        this.moveRandomly();
        this.shootRandomly();
        //this.spawnWallRandomly();
    }

    /**
     * Spawn Walls on random intervals.
     */
    private spawnWallRandomly(): void {
        if(this.getRandomIntInclusive(0, 5000) <= 1) {
            this.engine.inputHandler.handleKeyUp(this.getID(), " ");
        }
    }

    /**
     * Randomly move bot in space.
     * @returns No return value
     */
    private moveRandomly(): void {
        if (this.isShooting) {
            // wait to finish shooting before we move (this makes the bots easier to hit)
            return;
        } else {
            if (this.isMoving) {
                if (this.movementStepsTaken > this.movementStepsCap) {
                    this.stopMoving();
                }
                this.continueMoving();
            } else {
                this.startMoving();
            }
        }
    }

    /**
     * Shoot in random direction at random intervals.
     */
    private shootRandomly(): void {
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

    /**
     * Stop moving and begin firing in random direction.
     */
    private startShooting(): void {
        this.stopMoving();
        this.isShooting = true;
        this.shootingStepsTaken = 0;
        this.shootingStepsCap = this.getRandomIntInclusive(this.MIN_SHOOTING_STEPS, this.MAX_SHOOTING_STEPS);
        this.mousePos = this.chooseRandomMousePos();
    }

    /**
     * Continue to fire
     */
    private continueShooting(): void {
        // do modulo division to check if it's been x many updates since the last time we shot
        if (this.shootingStepsTaken % this.SHOOTING_INTERVAL == 0) {
            this.engine.inputHandler.handleMouseDownInput(this.getID(), this.mousePos);
        }
        this.shootingStepsTaken++;
    }

    /**
     * Stop firing actiton
     */
    private stopShooting(): void {
        this.isShooting = false;
    }

    /**
     * Determine if thte position of the body is within world bounds.
     * @returns true if in valid world-position, false otherwise.
     */
    private isWithinBounds(): boolean {
        const isWithinX: boolean = this.body.position.x >= this.WORLD_BOUND_X[0] 
                                && this.body.position.x <= this.WORLD_BOUND_X[1];
        const isWithinY: boolean = this.body.position.y >= this.WORLD_BOUND_Y[0] 
                                && this.body.position.y <= this.WORLD_BOUND_Y[1];
        return isWithinX && isWithinY;
    }

    /**
     * Begin move script.
     */
    private startMoving(): void {
        this.isMoving = true;
        this.movementStepsCap = this.getRandomIntInclusive(this.MIN_MOVEMENT_STEPS, this.MAX_MOVEMENT_STEPS);
        this.movementStepsTaken = 0;
        this.movementInput = this.chooseRandomKeyPress();
        // 75% chance to have a secondary input (so the bot can move diagonally)
        if (Math.random() < this.SECONDARY_MOVEMENT_FREQ && this.movementInput != this.NO_MOVEMENT) {  
            this.secondMovementInput = this.chooseRandomKeyPress();
            // if it's the same direction just cancel
            if (this.secondMovementInput == this.movementInput) {
                this.secondMovementInput = "";
            }
        }
        this.engine.inputHandler.handleKeyDown(this.getID(), this.movementInput);
        this.engine.inputHandler.handleKeyDown(this.getID(), this.secondMovementInput);
    }

    /**
     * Handle movement and constrain to in-bounds.
     */
    private continueMoving(): void {
        if (!this.isWithinBounds()) {
            // move in the opposite direction to try to get back inside bounds
            this.moveAwayFromBoundary();
        }
        this.movementStepsTaken++;
    }

    /**
     * Stop moving the bot.
     */
    private stopMoving(): void {
        this.engine.inputHandler.handleKeyUp(this.getID(), this.movementInput);
        this.engine.inputHandler.handleKeyUp(this.getID(), this.secondMovementInput);
        this.isMoving = false;
        this.movementStepsTaken = 0;
        this.movementStepsCap = 0;
        this.movementInput = this.NO_MOVEMENT;
        this.secondMovementInput = this.NO_MOVEMENT;
    }

    /**  
     * this is kind of a weird hack. i did it this way because the bot 
     * mimics keyboard inputs, it doesn't do any of its own math calculations,
     * it just defers to Player for that stuff
     */
    private moveAwayFromBoundary(): void {
        // stop moving
        this.engine.inputHandler.handleKeyUp(this.getID(), this.movementInput);
        this.engine.inputHandler.handleKeyUp(this.getID(), this.secondMovementInput);
        // set new direction opposite of wall bound
        if (this.body.position.x <= this.WORLD_BOUND_X[0]) {  // if is low x (left side of screen)
            this.movementInput = "d";  // move right
        } else if (this.body.position.y <= this.WORLD_BOUND_Y[0]) {  // low y (top of screen)
            this.movementInput = "s";  // move down
        } else if (this.body.position.x >= this.WORLD_BOUND_X[1]) {  // high x (right of screen)
            this.movementInput = "a";  // move left
        } else if (this.body.position.y >= this.WORLD_BOUND_Y[1]) {  // high y (bottom of screen)
            this.movementInput = "w";  // move up
        }
        this.engine.inputHandler.handleKeyDown(this.getID(), this.movementInput);
    }

    /**
     * Random-int with custom boundings
     * @param min Minimum possible value
     * @param max Maximum possible value
     * @returns Random number between min and max
     */
    private getRandomIntInclusive(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min); 
    }

    /**
     * Create a random x,y coordinate for mouse position.
     * @returns Random 2d coordinate within the world bounds
     */
    private chooseRandomMousePos(): [number, number] {
        const randomX = this.getRandomIntInclusive(this.WORLD_BOUND_X[0], this.WORLD_BOUND_X[1]);
        const randomY = this.getRandomIntInclusive(this.WORLD_BOUND_Y[0], this.WORLD_BOUND_Y[1]);
        const mousePos: [number, number] = [randomX, randomY];
        return mousePos;
    }

    /**
     * Choose a random direction to move, or stagnate.
     * @returns w, a, s, or d, or no_movement. Randomly Chosen
     */
    private chooseRandomKeyPress(): string {
        // "" (meaning NO_MOVEMENT) is added twice to the options so that the bots will pause more often
        const keyOptions = ["w", "a", "s", "d", this.NO_MOVEMENT, this.NO_MOVEMENT];
        const randomIndex = Math.floor(Math.random() * keyOptions.length);
        const randomKey = keyOptions[randomIndex];
        return randomKey;
    }
}
