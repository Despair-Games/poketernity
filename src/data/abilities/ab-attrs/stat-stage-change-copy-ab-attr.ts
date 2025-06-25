import { AbAttr } from "#abilities/ab-attr";
import { globalScene } from "#app/global-scene";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { BattleStat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";

export class StatStageChangeCopyAbAttr extends AbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(AbAttrFlag.STAT_STAGE_CHANGE_COPY);
  }

  public override apply(pokemon: Pokemon, simulated: boolean, stats: BattleStat[], stages: number): boolean {
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
    return true;
  }
}
