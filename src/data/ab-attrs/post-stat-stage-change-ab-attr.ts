import type { Pokemon } from "#app/field/pokemon";
import type { BattleStat } from "#enums/stat";
import { AbAttr } from "./ab-attr";

export class PostStatStageChangeAbAttr extends AbAttr {
  /**
   * Applies an effect after the source's stat stage(s) change
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @param statsChanged The {@linkcode BattleStat}s being changed
   * @param stagesChanged The change in stat stages
   * @param selfTarget `true` if the stat stage change came from the ability source
   * @returns `true` if effects successfully applied
   */
  override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _statsChanged: BattleStat[],
    _stagesChanged: number,
    _selfTarget: boolean,
  ): boolean {
    return false;
  }
}
