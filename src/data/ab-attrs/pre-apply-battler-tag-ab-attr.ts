import type { BattlerTag } from "#app/data/battler-tags";
import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import { AbAttr } from "./ab-attr";

export abstract class PreApplyBattlerTagAbAttr extends AbAttr {
  /**
   * Applies an effect before a battler tag is applied to the source
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @param tag The {@linkcode BattlerTag} being applied to the source
   * @param cancelled A {@linkcode BooleanHolder} which, if set to `true`,
   * negates the battler tag's effects.
   * @returns `true` if effects apply successfully
   */
  override apply(_pokemon: Pokemon, _simulated: boolean, _tag: BattlerTag, _cancelled: BooleanHolder): boolean {
    return false;
  }
}
