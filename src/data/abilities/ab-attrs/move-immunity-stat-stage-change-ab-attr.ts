import { MoveImmunityAbAttr } from "#abilities/move-immunity-ab-attr";
import { globalScene } from "#app/global-scene";
import type { BattleStat } from "#enums/stat";
import type { MoveImmunityAbAttrParams } from "#types/ab-attr-param-types";
import type { PreDefendAbAttrCondition } from "#types/ability-types";

export class MoveImmunityStatStageChangeAbAttr extends MoveImmunityAbAttr {
  private readonly stat: BattleStat;
  private readonly stages: number;

  constructor(immuneCondition: PreDefendAbAttrCondition, stat: BattleStat, stages: number) {
    super(immuneCondition);

    this.stat = stat;
    this.stages = stages;
  }

  public override apply(params: MoveImmunityAbAttrParams): void {
    super.apply(params);

    const { pokemon, simulated } = params;

    if (simulated) {
      return;
    }

    globalScene.phaseManager.createAndUnshiftPhase(
      "StatStageChangePhase",
      pokemon.getBattlerIndex(),
      pokemon,
      [this.stat],
      this.stages,
    );
  }
}
