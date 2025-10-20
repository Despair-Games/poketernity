import { PostKnockOutAbAttr } from "#abilities/post-knock-out-ab-attr";
import { globalScene } from "#app/global-scene";
import type { BattleStat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";

export class PostKnockOutStatStageChangeAbAttr extends PostKnockOutAbAttr {
  private readonly stat: BattleStat | ((p: Pokemon) => BattleStat);
  private readonly stages: number;

  constructor(stat: BattleStat | ((p: Pokemon) => BattleStat), stages: number) {
    super();

    this.stat = stat;
    this.stages = stages;
  }

  public override apply(pokemon: Pokemon, simulated: boolean, _knockedOutPokemon: Pokemon): void {
    const stat = typeof this.stat === "function" ? this.stat(pokemon) : this.stat;
    if (!simulated) {
      globalScene.phaseManager.createAndUnshiftPhase(
        "StatStageChangePhase",
        pokemon.getBattlerIndex(),
        pokemon,
        [stat],
        this.stages,
      );
    }
  }
}
