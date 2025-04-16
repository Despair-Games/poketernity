import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { BattleStat } from "#enums/stat";
import { AbAttr } from "./ab-attr";

export class PostIntimidateStatStageChangeAbAttr extends AbAttr {
  private readonly stats: BattleStat[];
  private readonly stages: number;

  constructor(stats: BattleStat[], stages: number) {
    super(true);
    this._flags.add(AbAttrFlag.POST_INTIMIDATE_STAT_STAGE_CHANGE);
    this.stats = stats;
    this.stages = stages;
  }

  override apply(pokemon: Pokemon, simulated: boolean): boolean {
    if (!simulated) {
      globalScene.phaseManager.unshiftPhase(
        new StatStageChangePhase(pokemon.getBattlerIndex(), pokemon, this.stats, this.stages),
      );
    }
    return true;
  }
}
