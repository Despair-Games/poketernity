import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import type { BattleStat } from "#enums/stat";
import { AbAttr } from "./ab-attr";

export class PreStatStageChangeAbAttr extends AbAttr {
  /**
   * Applies an effect before the source's stat stage(s) would change
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @param stat The {@linkcode BattleStat} being changed
   * @param cancelled A {@linkcode BooleanHolder} which, if `true`, negates
   * the stat stage change
   * @returns `true` if effects successfully applied
   */
  override apply(_pokemon: Pokemon, _simulated: boolean, _stat: BattleStat, _cancelled: BooleanHolder): boolean {
    return false;
  }
}
