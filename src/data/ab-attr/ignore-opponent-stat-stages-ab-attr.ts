import type Pokemon from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import { type BattleStat, BATTLE_STATS } from "#enums/stat";
import { AbAttr } from "./ab-attr";

/**
 * Ability attribute for ignoring the opponent's stat changes
 * @param stats the stats that should be ignored
 */
export class IgnoreOpponentStatStagesAbAttr extends AbAttr {
  private stats: readonly BattleStat[];

  constructor(stats?: BattleStat[]) {
    super(false);

    this.stats = stats ?? BATTLE_STATS;
  }

  /**
   * Modifies a BooleanHolder and returns the result to see if a stat is ignored or not
   * @param _pokemon n/a
   * @param _passive n/a
   * @param _simulated n/a
   * @param _cancelled n/a
   * @param args A BooleanHolder that represents whether or not to ignore a stat's stat changes
   * @returns true if the stat is ignored, false otherwise
   */
  override apply(_pokemon: Pokemon, _passive: boolean, _simulated: boolean, _cancelled: BooleanHolder, args: any[]) {
    if (this.stats.includes(args[0])) {
      (args[1] as BooleanHolder).value = true;
      return true;
    }
    return false;
  }
}
