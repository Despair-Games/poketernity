import { PostVictoryAbAttr } from "#abilities/post-victory-ab-attr";
import { globalScene } from "#app/global-scene";
import type { BattleStat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import type { BaseAbAttrParams } from "#types/ab-attr-param-types";

type StatOrStatFunc = BattleStat | ((p: Pokemon) => BattleStat);

export class PostVictoryStatStageChangeAbAttr extends PostVictoryAbAttr {
  private readonly stat: StatOrStatFunc;
  private readonly stages: number;

  constructor(stat: StatOrStatFunc, stages: number) {
    super();

    this.stat = stat;
    this.stages = stages;
  }

  public override apply({ pokemon, simulated }: BaseAbAttrParams): void {
    if (simulated) {
      return;
    }

    const stat = typeof this.stat === "function" ? this.stat(pokemon) : this.stat;
    globalScene.phaseManager.createAndUnshiftPhase(
      "StatStageChangePhase",
      pokemon.getBattlerIndex(),
      pokemon,
      [stat],
      this.stages,
    );
  }
}
