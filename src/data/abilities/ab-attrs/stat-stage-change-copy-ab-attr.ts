import { AbAttr } from "#abilities/ab-attr";
import { globalScene } from "#app/global-scene";
import type { StatStageChangeAbAttrParams } from "#types/ab-attr-param-types";

export class StatStageChangeCopyAbAttr extends AbAttr {
  protected override readonly abAttrKey = "StatStageChangeCopyAbAttr";

  constructor() {
    super(true);
  }

  public override apply({ pokemon, simulated, stats, stages }: StatStageChangeAbAttrParams): void {
    if (simulated) {
      return;
    }
    globalScene.phaseManager.createAndUnshiftPhase(
      "StatStageChangePhase",
      pokemon.getBattlerIndex(),
      pokemon,
      stats,
      stages,
      { canBeCopied: false },
    );
  }
}
