import type { Percentage } from "#app/@types/Percentage";
import { ConsumableItem } from "#app/data/items/consumable-item";
import type { Pokemon } from "#app/field/pokemon";

//#region Types

export type HealingItemHealAmount = number | Percentage;
export type HealingItemHealAmounts = [min: HealingItemHealAmount, max?: HealingItemHealAmount];

//#endregion

export abstract class HealingItem extends ConsumableItem {
  /**
   * Handles the items heal event.
   * @param pokemon The {@linkcode Pokemon} to heal.
   */
  public abstract onHeal(pokemon: Pokemon): void;
}
