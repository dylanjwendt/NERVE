export default class Helper {
  #private = 3;

  constructor() {
    this.#private = 4;
  }

  static getGreeting() {
    return 'Hello World!';
  }
}

export function hi() {
  console.log('hi');
}
