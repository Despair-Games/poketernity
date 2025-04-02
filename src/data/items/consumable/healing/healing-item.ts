import type { Percentage } from "#app/@types/Percentage";
import { ConsumableItem } from "#app/data/items/consumable-item";
import type { Pokemon } from "#app/field/pokemon";
import { percentToNumber } from "#app/utils";

//#region Types

export type HealingItemHealAmount = number | Percentage;
export type HealingItemHealAmounts = [min: HealingItemHealAmount, max?: HealingItemHealAmount];

//#endregion

export abstract class HealingItem extends ConsumableItem {
  protected abstract readonly healAmounts: HealingItemHealAmounts;

  /**
   * Handles the heal event for the {@linkcode pokemon}.
   * @param pokemon The {@linkcode Pokemon} to be healed
   */
  public abstract onHeal(pokemon: Pokemon): void;

  /**
   * Evaluates the {@linkcode healAmounts} array and returns the highest possible heal amount as an absolute value
   * @param pokemon The {@linkcode Pokemon} to be healed. Necessary to evaluate percentage values.
   * @returns The highest possible absolute heal amount as an absolute value
   */
  protected getHealAmount(pokemon: Pokemon): number {
    const [min, max] = this.healAmounts;

    const nMin = typeof min === "number" ? min : pokemon.getMaxHp() * percentToNumber(min);

    if (!max) {
      return nMin;
    }

    const nMax = typeof max === "number" ? max : pokemon.getMaxHp() * percentToNumber(max);

    return Math.max(nMin, nMax);
  }
}
