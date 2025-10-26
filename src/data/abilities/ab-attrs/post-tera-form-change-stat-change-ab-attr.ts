import { AbAttr } from "#abilities/ab-attr";
import { globalScene } from "#app/global-scene";
import type { BattleStat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";

/**
 * Used by Ogerpon's Embody Aspect ability.
 */
export class PostTeraFormChangeStatChangeAbAttr extends AbAttr {
  protected override readonly abAttrKey = "PostTeraFormChangeStatChangeAbAttr";
  private readonly stats: BattleStat[];
  private readonly stages: number;

  constructor(stats: BattleStat[], stages: number) {
    super(true);

    this.stats = stats;
    this.stages = stages;
  }

  public override apply(pokemon: Pokemon, simulated: boolean): void {
    if (!simulated) {
      globalScene.phaseManager.createAndUnshiftPhase(
        "StatStageChangePhase",
        pokemon.getBattlerIndex(),
        pokemon,
        this.stats,
        this.stages,
      );
    }
  }
}
