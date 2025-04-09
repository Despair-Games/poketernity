import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import { abAttrFlag } from "#enums/ab-attr-flag";
import type { BattleStat } from "#enums/stat";
import { AbAttr } from "./ab-attr";

export class StatStageChangeCopyAbAttr extends AbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(abAttrFlag.STAT_STAGE_CHANGE_COPY);
  }

  override apply(pokemon: Pokemon, simulated: boolean, stats: BattleStat[], stages: number): boolean {
    if (!simulated) {
      globalScene.phaseManager.unshiftPhase(
        new StatStageChangePhase(pokemon.getBattlerIndex(), pokemon, stats, stages, { canBeCopied: false }),
      );
    }
    return true;
  }
}
