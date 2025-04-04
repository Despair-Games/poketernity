import type { Pokemon } from "#app/field/pokemon";

export interface Consumable {
  beforeConsume?(): void;
  onConsume(pokemon: Pokemon): void;
  afterConsume?(): void;
}
