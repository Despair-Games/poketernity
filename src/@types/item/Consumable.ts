import type { Pokemon } from "#app/field/pokemon";

export interface Consumable {
  beforeConsume?(): void;
  onConsume(context: ConsumeContext): void;
  afterConsume?(): void;
}

//#region Utility types

export interface ConsumeContext {
  pokemon: Pokemon;
}

//#endregion
