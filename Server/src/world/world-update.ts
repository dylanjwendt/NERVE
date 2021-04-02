import Bullet from "./entities/bullet";
import { IEntity } from "./entities/entity.interface";
import Player from "./entities/player";
import clamp from "./utils/clamp";

export class WorldUpdate {

    private entities: IEntity[];
    private width: number;
    private height: number;

    constructor() {
        this.entities = [];
        this.width = 1920;
        this.height = 1080;
    }

    public update(deltaTime: number): string {
        this.entities.forEach((e, i) => {
            e.update();
            if (e instanceof Bullet) {
                if (e.x < 0 || e.y < 0 || e.x > this.width || e.y > this.height) {
                    this.entities.splice(i, 1);
                }
            }
            if (e instanceof Player) {
                e.x = clamp(e.x, 0, this.width - e.width);
                e.y = clamp(e.y, 0, this.height - e.height);
            }
        });
        return JSON.stringify(this.entities);
    }

    public processInput(eventType: string, input: string): string {
        // console.log(`world update process input. eventType=${eventType}, input=${input}`);

        const inputData = JSON.parse(input);
        const playerId = inputData.player;
        const player = this.entities.find((value) => value.id === playerId) as Player;

        if (eventType === "keydown" && player) {
            const key: string = inputData.key;
            if (key === "w") {
                player.updateDirection({ up: true });
            } else if (key === "a") {
                player.updateDirection({ left: true });
            } else if (key === "s") {
                player.updateDirection({ down: true });
            } else if (key === "d") {
                player.updateDirection({ right: true });
            }
        }

        if (eventType === "keyup" && player) {
            const key: string = inputData.key;
            if (key === "w") {
                player.updateDirection({ up: false });
            } else if (key === "a") {
                player.updateDirection({ left: false });
            } else if (key === "s") {
                player.updateDirection({ down: false });
            } else if (key === "d") {
                player.updateDirection({ right: false });
            }
        }


        if (eventType === "mousedown" && player) {
            const bullet = new Bullet([player.x, player.y], inputData.mousePos);
            this.entities.push(bullet);
        }

        return JSON.stringify(this.entities);
    }

    /**
     * Creates a new player entity with specified id that the server will automatically update.
     * @param id Client id
     * @returns The id of the new player
     */
    public addPlayer(id: string): string {
        const newPlayer = new Player(id);
        this.entities.push(newPlayer);
        return newPlayer.id;
    }

    /**
     * Finds and removes an entity given an id, if it exists.
     * @param id id of the entity
     */
    public removePlayer(id: string): void {
        const index = this.entities.findIndex((e) => e.id === id);
        if (index) {
            this.entities.splice(index, 1);
        }
    }
}