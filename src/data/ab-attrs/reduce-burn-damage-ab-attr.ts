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
    (args[0] as NumberHolder).value = toDmgValue((args[0] as NumberHolder).value * this.multiplier);

    return true;
  }
}
