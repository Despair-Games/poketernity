//#region Types

interface StarterColors {
  [key: string]: [string, string];
}

//#endregion
//#region Exports

export let starterColors: StarterColors;

/**
 * Reset `starterColors`. Sets it to an empty object (`{}`)
 */
export function resetStarterColors(): void {
  starterColors = {};
}

//#endregion
