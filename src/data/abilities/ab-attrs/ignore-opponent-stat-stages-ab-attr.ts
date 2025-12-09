import { AbAttr } from "#abilities/ab-attr";
import { BATTLE_STATS, type BattleStat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";

/**
 * Ability attribute for ignoring the opponent's stat changes
 * @param stats the stats that should be ignored
 */
export class IgnoreOpponentStatStagesAbAttr extends AbAttr {
  protected override readonly abAttrKey = "IgnoreOpponentStatStagesAbAttr";
  private readonly stats: readonly BattleStat[];

  constructor(stats: readonly BattleStat[] = BATTLE_STATS) {
    super();

    this.stats = stats;
  }

  /**
   * @param pokemon - The {@linkcode Pokemon} with this attribute
   * @param simulated - If `true`, suppresses changes to game state
   * @param stat - The {@linkcode BattleStat} whose stages may be ignored
   * @param ignoreStatStage - If set to `true`, stat stages for the given stat are ignored
   */
  public override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _stat: BattleStat,
    ignoreStatStage: ValueHolder<boolean>,
  ): void {
    ignoreStatStage.value = true;
  }

  public override canApply(...[, , stat]: Parameters<this["apply"]>): boolean {
    return this.stats.includes(stat);
  }
}
