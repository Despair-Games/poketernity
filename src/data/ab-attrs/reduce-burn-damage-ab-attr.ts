import type { Pokemon } from "#app/field/pokemon";
import { type BooleanHolder, type NumberHolder, toDmgValue } from "#app/utils";
import { AbAttr } from "./ab-attr";

/**
 * Causes Pokemon to take reduced damage from the {@linkcode StatusEffect.BURN | Burn} status
 * @param multiplier Multiplied with the damage taken
 */
export class ReduceBurnDamageAbAttr extends AbAttr {
  constructor(protected multiplier: number) {
    super(false);
  }

  /**
   * Applies the damage reduction
   * @param _pokemon N/A
   * @param _passive N/A
   * @param _cancelled N/A
   * @param args `[0]` {@linkcode NumberHolder} The damage value being modified
   * @returns `true`
   */
  override apply(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    const damage: NumberHolder = args[0];
    damage.value = toDmgValue(damage.value * this.multiplier);

    return true;
  }
}
