import { PostTurnAbAttr } from "#abilities/post-turn-ab-attr";
import { globalScene } from "#app/global-scene";
import { Stat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";

export class SpeedBoostAbAttr extends PostTurnAbAttr {
  public override apply(pokemon: Pokemon, simulated: boolean): void {
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

  public override canApply(...[pokemon]: Parameters<this["apply"]>): boolean {
    const { switchedInThisTurn, failedRunAway } = pokemon.turnData;
    return !switchedInThisTurn && !failedRunAway;
  }
}
