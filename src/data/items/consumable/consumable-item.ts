import type { Pokemon } from "#app/field/pokemon";
import { BaseItem } from "../base-item";

/**
 * Consumable items represent items that are immediately used up upon selecting
 */
export abstract class ConsumableItem extends BaseItem {
  public beforeConsume(): void {}

  public abstract onConsume(pokemon: Pokemon): void;

  public afterConsume(): void {}
}
