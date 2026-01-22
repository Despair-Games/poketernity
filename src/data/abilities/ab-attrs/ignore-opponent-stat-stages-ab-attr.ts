import { AbAttr } from "#abilities/ab-attr";
import { BATTLE_STATS, type BattleStat } from "#enums/stat";
import type { IgnoreOpponentStatStagesAbAttrParams } from "#types/ab-attr-param-types";

/**
 * Ability attribute for ignoring the opponent's stat changes
 * @param stats - The stats that should be ignored
 */
export class IgnoreOpponentStatStagesAbAttr extends AbAttr {
  protected override readonly abAttrKey = "IgnoreOpponentStatStagesAbAttr";

  private readonly stats: readonly BattleStat[];

  constructor(stats: readonly BattleStat[] = BATTLE_STATS) {
    super();

    this.stats = stats;
  }

  public override apply({ ignoreStatStage }: IgnoreOpponentStatStagesAbAttrParams): void {
    ignoreStatStage.value = true;
  }

  public override canApply({ stat }: Parameters<this["apply"]>[0]): boolean {
    return this.stats.includes(stat);
  }
}
