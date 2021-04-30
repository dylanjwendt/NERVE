# NERVE

NERVE is a 2D, non-Euclidean .io game engine with integrated an integrated client/server. The goal of NERVE is to make
developing .io games easier by providing a single comprehensive API and taking over tasks such as netcode and state
synchronization. The non-Euclidean aspect is to give developers greater creative liberties in implementing their games.

## Getting started

* Clone this repo and cd into where you cloned it
* Go to each subproject (Client/, Server/, Engine/, Demo/) and run `npm install`
* Go to each subproject in this order: Engine/, Demo/, Server, Client/ and run `npm run build`
  * Do not combine this step with the `npm install` step
* cd into Server/ and run `npm serve`
* Open a web browser (preferably with hardware acceleration enabled) and navigate to `http://localhost:3000`. The game
should now be running!

To implement your own game: extend the abstract classes Actor, ActorInteraction, and/or InputHandler as you see fit.
See the example game in Demo/ for more details.

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
