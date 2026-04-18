import { AbAttr } from "#abilities/ab-attr";
import { globalScene } from "#app/global-scene";
import type { BattleStat } from "#enums/stat";
import type { BaseAbAttrParams } from "#types/ab-attr-param-types";

/**
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Embody_Aspect_(Ability)}
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

  public override apply({ pokemon, simulated }: BaseAbAttrParams): void {
    if (simulated) {
      return;
    }

    globalScene.phaseManager.createAndUnshiftPhase(
      "StatStageChangePhase",
      pokemon.getBattlerIndex(),
      pokemon,
      this.stats,
      this.stages,
    );
  }
}
