import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { AbAttr } from "./ab-attr";

/**
 * Attribute for abilities that increase the chance of a double battle
 * occurring.
 * @see apply
 */
export class DoubleBattleChanceAbAttr extends AbAttr {
  constructor() {
    super(false);
    this._flags.add(AbAttrFlag.DOUBLE_BATTLE_CHANCE);
  }

  /**
   * Increases the chance of a double battle occurring
   * @param doubleBattleChance {@linkcode NumberHolder} for double battle chance
   * @returns true if the ability was applied
   */
  override apply(_pokemon: Pokemon, _simulated: boolean, doubleBattleChance: NumberHolder): boolean {
    // This is divided because the chance is generated as a number from 0 to doubleBattleChance.value using Utils.randSeedInt
    // A double battle will initiate if the generated number is 0
    doubleBattleChance.value = doubleBattleChance.value / 4;

    return true;
  }
}
