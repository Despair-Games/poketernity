import type { Pokemon } from "#app/field/pokemon";

export interface Holdable {
  readonly isTransferable: boolean;
  readonly isIgnorable: boolean;

  onFling(context: FlingContext): void;
}

//#region Utility types

export interface FlingContext {
  sourcePokemon: Pokemon;
  targetPokemon: Pokemon;
}

//#endregion
