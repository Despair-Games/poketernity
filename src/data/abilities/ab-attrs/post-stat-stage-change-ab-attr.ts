import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { BattleStat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";

export abstract class PostStatStageChangeAbAttr extends AbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
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
   * @returns `true` if effects successfully applied
   */
  public override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _statsChanged: BattleStat[],
    _stagesChanged: number,
    _source: Pokemon | null,
    _isStickyWeb: boolean,
  ): boolean {
    return false;
  }
}
