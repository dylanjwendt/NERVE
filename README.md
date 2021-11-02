# NERVE

NERVE is a realtime  multiplayer game engine with an integrated client/server.
The goal of NERVE is to make developing .io games easier by providing a single comprehensive API and taking over tasks
such as netcode and state synchronization.

## Getting started

1. Install Node.js. We develop with LTS v14.16.0 but NERVE will probably work with later versions.
    * If you are on Linux or macOS then we recommend you use [nvm](https://github.com/nvm-sh/nvm) to install Node.
    * `npm` comes with Node.js. You'll need an npm version >=v7.16 in order to use npm workspaces.

2. How you scaffold a NERVE project depends on what you plan to do with it:
    * For consumers/testers, run `npx degit https://github.com/dylanjwendt/NERVE`
    * For contributors, run `git clone https://github.com/dylanjwendt/NERVE`
    * The difference is using degit will not set up a git repo and you cannot push/pull to this repo.

3. From the root level run these commands in order:
    ```bash
    npm install --legacy-peer-deps --include=dev
    npm run -s build
    npm run -s start
    ```

4. Open a web browser (preferably with hardware acceleration enabled) and navigate to `http://localhost:3000`.
The demo game should now be running!

5. Consumers/testers can begin developing their game in the Demo/ directory. After any changes, just run
   `npm run -s build` from the top level and then `npm run -s start` to start the server again.
   
   Developers should read the [contributing guidelines](./CONTRIBUTING.md).

6. You can find NERVE's API documentation here: https://dylanjwendt.github.io/NERVE/modules.html

### Overview of scripts
You can run these npm scripts by running `npm run -s <script-name>` at the root level.

| Script name | What it does                                            |
| ----------- | ------------------------------------------------------- |
| start       | run the project, if it has been built                   |
| build       | builds all four subprojects in the correct build order  |
| clean       | deletes all built files, leaving only source code       |
| lint        | lints code according to this repo's code guidelines     |
| lint:fix    | lints code, but also automatically fixes what it can    |
| prod        | same as running `build` then `start`, but in one script |
| dev         | starts a development environment (see below)            |

The development environment runs the client on `http://localhost:3001` and will live reload the client whenever the
client code is changed. Whenever server code is changed, it will rebuild and restart the server. When the server
restarts you will have to reload the client to reconnect. Furthermore, changing static assets in your client
(like textures and sounds) will not reload properly, you will have to restart the environment to see the changes.

P.S You can run a script on an individual subproject by adding `--workspace=<Client|Server|Engine|Demo>` to the end of
the `npm run` command. This can be useful if you only want to rebuild one of them!

## Authors and Acknowledgements

* Luke Ludlow
* Jordan Taylor
* Calvin Tu
* Dylan Wendt
* University of Utah
* postal.js authors
* Colyseus authors
* Pixi.js authors

## License
[MIT](./LICENSE.md)
