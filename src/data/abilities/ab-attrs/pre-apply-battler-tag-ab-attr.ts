import { AbAttr } from "#abilities/ab-attr";
import type { BattlerTag } from "#battler-tags/battler-tag";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";

export abstract class PreApplyBattlerTagAbAttr extends AbAttr {
  /**
   * Applies an effect before a battler tag is applied to the source
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @param tag The {@linkcode BattlerTag} being applied to the source
   * @param cancelled A {@linkcode BooleanHolder} which, if set to `true`,
   * negates the battler tag's effects.
   */
  public abstract override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _tag: BattlerTag,
    _cancelled: ValueHolder<boolean>,
  ): void;
}
