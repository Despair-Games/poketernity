import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import { type BattleStat, BATTLE_STATS } from "#enums/stat";
import { AbAttr } from "./ab-attr";

/**
 * Ability attribute for ignoring the opponent's stat changes
 * @param stats the stats that should be ignored
 */
export class IgnoreOpponentStatStagesAbAttr extends AbAttr {
  private readonly stats: readonly BattleStat[];

  constructor(stats?: BattleStat[]) {
    super(false);

    this.stats = stats ?? BATTLE_STATS;
  }

  /**
   * Modifies a BooleanHolder and returns the result to see if a stat is ignored or not
   * @param pokemon n/a
   * @param simulated n/a
   * @param stat The {@linkcode BattleStat} to be ignored by this ability
   * @param ignoreStatStage A {@linkcode BooleanHolder} that represents whether or not to ignore a stat's stat changes
   * @returns true if the stat is ignored, false otherwise
   */
  override apply(_pokemon: Pokemon, _simulated: boolean, stat: BattleStat, ignoreStatStage: BooleanHolder) {
    if (this.stats.includes(stat)) {
      ignoreStatStage.value = true;
      return true;
    }
    return false;
  }
}
