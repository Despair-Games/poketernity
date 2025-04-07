import type { Pokemon } from "#app/field/pokemon";

/**
 * An item that can be consumed by a {@linkcode Pokemon}.
 */
export interface Consumable {
  /** Called when the item is consumed */
  onConsume(context: ConsumeContext): void;
}

//#region Utility types

export interface ConsumeContext {
  pokemon: Pokemon;
}

//#endregion
