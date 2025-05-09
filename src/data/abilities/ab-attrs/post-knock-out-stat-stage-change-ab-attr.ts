import { PostKnockOutAbAttr } from "#abilities/post-knock-out-ab-attr";
import { globalScene } from "#app/global-scene";
import type { BattleStat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import { StatStageChangePhase } from "#phases/stat-stage-change-phase";

export class PostKnockOutStatStageChangeAbAttr extends PostKnockOutAbAttr {
  private readonly stat: BattleStat | ((p: Pokemon) => BattleStat);
  private readonly stages: number;

  constructor(stat: BattleStat | ((p: Pokemon) => BattleStat), stages: number) {
    super();

    this.stat = stat;
    this.stages = stages;
  }

  override apply(pokemon: Pokemon, simulated: boolean, _knockedOutPokemon: Pokemon): boolean {
    const stat = typeof this.stat === "function" ? this.stat(pokemon) : this.stat;
    if (!simulated) {
      globalScene.phaseManager.unshiftPhase(
        new StatStageChangePhase(pokemon.getBattlerIndex(), pokemon, [stat], this.stages),
      );
    }
    return true;
  }
}
