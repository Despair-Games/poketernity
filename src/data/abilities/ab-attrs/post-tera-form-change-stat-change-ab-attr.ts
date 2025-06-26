import { AbAttr } from "#abilities/ab-attr";
import { globalScene } from "#app/global-scene";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { BattleStat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";

/**
 * Used by Ogerpon's Embody Aspect ability.
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

  public override apply(pokemon: Pokemon, simulated: boolean): boolean {
    if (!simulated) {
      globalScene.phaseManager.createAndUnshiftPhase(
        "StatStageChangePhase",
        pokemon.getBattlerIndex(),
        pokemon,
        this.stats,
        this.stages,
      );
    }

    return true;
  }
}
