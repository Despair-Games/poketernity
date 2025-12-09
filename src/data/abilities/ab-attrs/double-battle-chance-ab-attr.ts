import { AbAttr } from "#abilities/ab-attr";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";

/**
 * Attribute for abilities that increase the chance of a double battle
 * occurring.
 */
export class DoubleBattleChanceAbAttr extends AbAttr {
  protected override readonly abAttrKey = "DoubleBattleChanceAbAttr";

  /**
   * Increases the chance of a double battle occurring
   * @param doubleBattleChance {@linkcode NumberHolder} for double battle chance
   * @returns true if the ability was applied
   */
  public override apply(_pokemon: Pokemon, _simulated: boolean, doubleBattleChance: ValueHolder<number>): void {
    // This is divided because the chance is generated as a number from 0 to doubleBattleChance.value using Utils.randSeedInt
    // A double battle will initiate if the generated number is 0
    doubleBattleChance.value /= 4;
  }
}
