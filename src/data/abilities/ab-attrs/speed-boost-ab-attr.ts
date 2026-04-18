import { PostTurnAbAttr } from "#abilities/post-turn-ab-attr";
import { globalScene } from "#app/global-scene";
import { Stat } from "#enums/stat";
import type { BaseAbAttrParams } from "#types/ab-attr-param-types";

export class SpeedBoostAbAttr extends PostTurnAbAttr {
  public override apply({ pokemon, simulated }: BaseAbAttrParams): void {
    if (!simulated) {
      globalScene.phaseManager.createAndUnshiftPhase(
        "StatStageChangePhase",
        pokemon.getBattlerIndex(),
        pokemon,
        [Stat.SPD],
        1,
      );
    }
  }

  public override canApply({ pokemon }: Parameters<this["apply"]>[0]): boolean {
    const { switchedInThisTurn, failedRunAway } = pokemon.turnData;
    return !switchedInThisTurn && !failedRunAway;
  }
}
