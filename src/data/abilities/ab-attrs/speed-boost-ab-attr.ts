import { PostTurnAbAttr } from "#abilities/post-turn-ab-attr";
import { globalScene } from "#app/global-scene";
import { Stat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";

export class SpeedBoostAbAttr extends PostTurnAbAttr {
  public override apply(pokemon: Pokemon, simulated: boolean): boolean {
    if (!simulated) {
      if (!pokemon.turnData.switchedInThisTurn && !pokemon.turnData.failedRunAway) {
        globalScene.phaseManager.createAndUnshiftPhase(
          "StatStageChangePhase",
          pokemon.getBattlerIndex(),
          pokemon,
          [Stat.SPD],
          1,
        );
      } else {
        return false;
      }
    }
    return true;
  }
}
