import { PostKnockOutAbAttr } from "#abilities/post-knock-out-ab-attr";
import { globalScene } from "#app/global-scene";
import type { BattleStat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import type { PostKnockOutAbAttrParams } from "#types/ab-attr-param-types";

type StatOrStatFunc = BattleStat | ((p: Pokemon) => BattleStat);

export class PostKnockOutStatStageChangeAbAttr extends PostKnockOutAbAttr {
  private readonly stat: StatOrStatFunc;
  private readonly stages: number;

  constructor(stat: StatOrStatFunc, stages: number) {
    super();

    this.stat = stat;
    this.stages = stages;
  }

  public override apply({ pokemon, simulated }: PostKnockOutAbAttrParams): void {
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
