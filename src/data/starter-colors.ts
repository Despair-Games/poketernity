//#region Types

interface StarterColors {
  [key: string]: [string, string];
}

//#endregion
//#region Exports

export let starterColors: StarterColors;

/**
 * Setter for `starterColors`
 */
export function setStarterColors(colors: StarterColors): void {
  starterColors = colors;
}

//#endregion
