import { AbAttr } from "#app/data/abilities/ab-attrs/ab-attr";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { BattleStat } from "#enums/stat";

/**
 * Used by Ogerpon's Embody Aspect ability.
 * @extends AbAttr
 */
export class PostTeraFormChangeStatChangeAbAttr extends AbAttr {
  private readonly stats: BattleStat[];
  private readonly stages: number;

  constructor(stats: BattleStat[], stages: number) {
    super(true, true);

    this.stats = stats;
    this.stages = stages;
    this._flags.add(AbAttrFlag.POST_TERA_FORM_CHANGE_STAT_CHANGE);
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
