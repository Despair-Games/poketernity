import type { Pokemon } from "#app/field/pokemon";

/**
 * An item that can be transferred from one {@linkcode Pokemon} to another.
 */
export interface Transferable {
  /** Called when the item is transferred */
  onTransfer(context: TransferContext): void;
}

//#region Utility types

export interface TransferContext {
  /** The {@linkcode Pokemon} transferring the item */
  sourcePokemon: Pokemon;
  /** The {@linkcode Pokemon} receiving the item */
  targetPokemon: Pokemon;
}

//#endregion
