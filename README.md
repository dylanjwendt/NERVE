# NERVE

NERVE is a realtime non-Euclidean multiplayer game engine with integrated an integrated client/server.
The goal of NERVE is to make developing .io games easier by providing a single comprehensive API and taking over tasks
such as netcode and state synchronization. The non-Euclidean aspect is to give developers greater creative liberties in
implementing their games.

## Getting started

1. Install Node.js. We develop with LTS v14.16.0 but NERVE will probably work with later versions.
    * If you are on Linux or macOS then we recommend you use [nvm](https://github.com/nvm-sh/nvm) to install Node.
    * `npm` comes with Node.js. You'll need an npm version >=v7.16 in order to use npm workspaces.

2. How you scaffold a NERVE project depends on what you plan to do with it:
    * For consumers/testers, run `npx degit https://github.com/dylanjwendt/NERVE`
    * For contributors, run `git clone npx degit https://github.com/dylanjwendt/NERVE`
    * Remember to `cd` into the NERVE directory.

3. From the root level run these commands in order:
    ```bash
    $ npm install --legacy-peer-deps --include=dev
    $ npm run -s build
    $ npm run -s start
    ```

4. Open a web browser (preferably with hardware acceleration enabled) and navigate to `http://localhost:3000`.
The demo game should now be running!

* P.S running `npm run -s start` will automatically build all subprojects if the server has not been built yet.

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
