import { AbAttr } from "#abilities/ab-attr";
import type { BattleStat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";

export abstract class PreStatStageChangeAbAttr extends AbAttr {
  /**
   * Applies an effect before the source's stat stage(s) would change
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @param stat The {@linkcode BattleStat} being changed
   * @param cancelled A {@linkcode ValueHolder} which, if `true`, negates
   * the stat stage change
   */
  public abstract override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _stat: BattleStat,
    _cancelled: ValueHolder<boolean>,
  ): void;
}
