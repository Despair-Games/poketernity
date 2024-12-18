import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import type { BooleanHolder } from "#app/utils";
import type { BattleStat } from "#enums/stat";
import { AbAttr } from "./ab-attr";

export class StatStageChangeCopyAbAttr extends AbAttr {
  override apply(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    _cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    const stats: BattleStat[] = args[0];
    const stages: number = args[1];
    if (!simulated) {
      globalScene.unshiftPhase(
        new StatStageChangePhase(pokemon.getBattlerIndex(), true, stats, stages, true, false, false),
      );
    }
    return true;
  }
}
