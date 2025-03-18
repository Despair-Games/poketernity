import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import type { BattleStat } from "#enums/stat";
import { FlinchEffectAbAttr } from "./flinch-effect-ab-attr";

export class FlinchStatStageChangeAbAttr extends FlinchEffectAbAttr {
  private readonly stats: BattleStat[];
  private readonly stages: number;

  constructor(stats: BattleStat[], stages: number) {
    super();

    this.stats = Array.isArray(stats) ? stats : [stats];
    this.stages = stages;
  }

  override apply(pokemon: Pokemon, simulated: boolean): boolean {
    if (!simulated) {
      globalScene.unshiftPhase(new StatStageChangePhase(pokemon.getBattlerIndex(), pokemon, this.stats, this.stages));
    }
    return true;
  }
}
