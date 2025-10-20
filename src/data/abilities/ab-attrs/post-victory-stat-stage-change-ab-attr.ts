import { PostVictoryAbAttr } from "#abilities/post-victory-ab-attr";
import { globalScene } from "#app/global-scene";
import type { BattleStat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";

export class PostVictoryStatStageChangeAbAttr extends PostVictoryAbAttr {
  private readonly stat: BattleStat | ((p: Pokemon) => BattleStat);
  private readonly stages: number;

  constructor(stat: BattleStat | ((p: Pokemon) => BattleStat), stages: number) {
    super();

    this.stat = stat;
    this.stages = stages;
  }

  public override apply(pokemon: Pokemon, simulated: boolean): void {
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
