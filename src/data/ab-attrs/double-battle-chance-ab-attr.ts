import type Pokemon from "#app/field/pokemon";
import type { BooleanHolder, NumberHolder } from "#app/utils";
import { AbAttr } from "./ab-attr";

/**
 * Attribute for abilities that increase the chance of a double battle
 * occurring.
 * @see apply
 */
export class DoubleBattleChanceAbAttr extends AbAttr {
  constructor() {
    super(false);
  }

  /**
   * Increases the chance of a double battle occurring
   * @param args [0] {@linkcode NumberHolder} for double battle chance
   * @returns true if the ability was applied
   */
  override apply(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    const doubleBattleChance = args[0] as NumberHolder;
    // This is divided because the chance is generated as a number from 0 to doubleBattleChance.value using Utils.randSeedInt
    // A double battle will initiate if the generated number is 0
    doubleBattleChance.value = doubleBattleChance.value / 4;

    return true;
  }
}
