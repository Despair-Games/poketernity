import type { Pokemon } from "#app/field/pokemon";
import { BaseItem } from "#app/data/items/base-item";

/**
 * Consumable items represent items that are immediately used up upon selecting
 */
export abstract class ConsumableItem extends BaseItem {
  beforeConsume?(): void {}

  public abstract onConsume?(pokemon: Pokemon): void;

  public afterConsume(): void {}
}
