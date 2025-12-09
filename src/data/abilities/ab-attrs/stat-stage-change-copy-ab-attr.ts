import { AbAttr } from "#abilities/ab-attr";
import { globalScene } from "#app/global-scene";
import type { BattleStat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";

export class StatStageChangeCopyAbAttr extends AbAttr {
  protected override readonly abAttrKey = "StatStageChangeCopyAbAttr";

  constructor() {
    super(true);
  }

  public override apply(pokemon: Pokemon, simulated: boolean, stats: BattleStat[], stages: number): void {
    if (!simulated) {
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
}
