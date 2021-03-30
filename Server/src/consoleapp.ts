import * as readline from "readline";
import * as readlineSync from "readline-sync";
import { Client, Room } from "colyseus.js";
import { GameState } from "./rooms/GameState";
import { DataChange } from "@colyseus/schema";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("enter your username: ", (answer: string) => {
    const username = answer;
    connectToServer(username);
});

const connectToServer = (username: string) => {
    console.log("connecting to game server...");
    const gameClient = new Client("ws://localhost:2567");
    let room: Room<GameState>;
    async function connect() {
        try {
            room = await gameClient.joinOrCreate<GameState>("my_room", {
                name: username
            });
            room.onMessage("*", (messageType, [sessionId, message]) => {
                console.log(message);
            });
            room.onLeave((code: any) => {
                console.log("you've been disconnected.");
            });
        } catch (e) {
            console.error("couldn't connect:", e);
        }
    }
    connect();



    rl.on("line", (line: string) => {
        room.send("basic", `${username}: ${line.trim()}`);
    }).on("close", () => {
        room.send("basic", `${username} has left the chat`);
        process.exit(0);
    });

};