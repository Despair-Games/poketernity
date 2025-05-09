import { PostVictoryAbAttr } from "#abilities/post-victory-ab-attr";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { BattleStat } from "#enums/stat";
import { StatStageChangePhase } from "#phases/stat-stage-change-phase";

export class PostVictoryStatStageChangeAbAttr extends PostVictoryAbAttr {
  private readonly stat: BattleStat | ((p: Pokemon) => BattleStat);
  private readonly stages: number;

  constructor(stat: BattleStat | ((p: Pokemon) => BattleStat), stages: number) {
    super();

    this.stat = stat;
    this.stages = stages;
  }

  override apply(pokemon: Pokemon, simulated: boolean): boolean {
    const stat = typeof this.stat === "function" ? this.stat(pokemon) : this.stat;
    if (!simulated) {
      globalScene.phaseManager.unshiftPhase(
        new StatStageChangePhase(pokemon.getBattlerIndex(), pokemon, [stat], this.stages),
      );
    }
    return true;
  }
}
