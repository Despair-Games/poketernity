import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { BattleStat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";

export abstract class PostStatStageChangeAbAttr extends AbAttr {
  constructor() {
    super(true);
    this._flags.add(AbAttrFlag.POST_STAT_STAGE_CHANGE);
  }

  /**
   * Applies an effect after the source's stat stage(s) change
   * @param pokemon - The {@linkcode Pokemon} with this ability
   * @param simulated - If `true`, suppresses changes to game state
   * @param statsChanged - The {@linkcode BattleStat}s being changed
   * @param stagesChanged - The change in stat stages
   * @param source - The source Pokemon that inflicted/activated the stat change
   * @param isStickyWeb - `true` if and only if Sticky Web inflicted the stat change
   */
  public abstract override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _statsChanged: BattleStat[],
    _stagesChanged: number,
    _source: Pokemon | undefined,
    _isStickyWeb: boolean,
  ): void;
}
