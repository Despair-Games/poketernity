import type { Pokemon } from "#app/field/pokemon";

/**
 * An item that can be held by a {@linkcode Pokemon}.
 */
export interface Holdable {
  /** The damage the item does when flung */
  readonly flingDamage: number;
  /** Whether the item can be transferred */
  readonly isTransferable: boolean;
  /** Whether the item's effect can be prevented. E.g. by the {@link https://bulbapedia.bulbagarden.net/wiki/Klutz_(Ability) Klutz} ability */
  readonly isEffectPreventable: boolean;

  /** Event handler for the item being flung */
  onFling(context: FlingContext): void;
  /** Event handler for the item being transferred */
  onTransfer?(context: TransferContext): void;
  /** Event handler for the item's effect being prevented */
  onEffectPrevented?(context: EffectPreventedContext): void;
}

//#region Utility types

export interface FlingContext {
  /** The {@linkcode Pokemon} that the item is flung at */
  targetPokemon: Pokemon;
}

export interface TransferContext {
  /** The {@linkcode Pokemon} that the item is transferred **FROM** */
  sourcePokemon: Pokemon;
  /** The {@linkcode Pokemon} that the item is transferred **TO** */
  targetPokemon: Pokemon;
}

export interface EffectPreventedContext {}

//#endregion
