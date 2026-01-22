import { AbAttr } from "#abilities/ab-attr";
import type { DoubleBattleChanceAbAttrParams } from "#types/ab-attr-param-types";

/** Attribute for abilities that increase the chance of a double battle occurring. */
export class DoubleBattleChanceAbAttr extends AbAttr {
  protected override readonly abAttrKey = "DoubleBattleChanceAbAttr";

  public override apply({ doubleBattleChance }: DoubleBattleChanceAbAttrParams): void {
    // This is divided because the chance is generated as a number from 0 to `doubleBattleChance.value` using `randSeedInt`
    // A double battle will initiate if the generated number is 0
    doubleBattleChance.value /= 4;
  }
}
