const $ = (x: string) => document.querySelector(x);

interface FieldLocalization {
  [key: string]: string
}

const fieldLocalizations: FieldLocalization = {
  playerX: 'Player X',
  playerY: 'Player Y',
  fps: 'FPS',
  syncRate: 'Last sync',
  numEntities: 'Entities',
};

export interface DebugScreenInfo {
  playerX: number,
  playerY: number,
  fps: number,
  syncRate: number,
  numEntities: number,
}

/**
 * Handles updating the debug screen by directly modifying HTML elements
 */
export class DebugScreen {
  static update(info: DebugScreenInfo): void {
    Object.entries(info).forEach(([key, value]) => {
      const elem = $(`#debug-screen p[data-field-${key}]`);
      if (elem) {
        let text = value;
        if (typeof value === 'number') { text = value.toFixed(2); }
        elem.textContent = `${fieldLocalizations[key]}: ${text.toString()}`;
      }
    });
  }
}
