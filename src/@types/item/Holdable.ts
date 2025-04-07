import type { Pokemon } from "#app/field/pokemon";

/**
 * An item that can be held by a {@linkcode Pokemon}.
 */
export interface Holdable {
  readonly flingDamage: number;

  onFling(context: FlingContext): void;
}

//#region Utility types

export interface FlingContext {
  /** The {@linkcode Pokemon} that the item is flung at */
  targetPokemon: Pokemon;
}

//#endregion
