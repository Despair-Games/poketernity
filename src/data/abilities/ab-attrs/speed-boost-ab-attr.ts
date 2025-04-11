import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import { Stat } from "#enums/stat";
import { PostTurnAbAttr } from "./post-turn-ab-attr";

export class SpeedBoostAbAttr extends PostTurnAbAttr {
  override apply(pokemon: Pokemon, simulated: boolean): boolean {
    if (!simulated) {
      if (!pokemon.turnData.switchedInThisTurn && !pokemon.turnData.failedRunAway) {
        globalScene.phaseManager.unshiftPhase(
          new StatStageChangePhase(pokemon.getBattlerIndex(), pokemon, [Stat.SPD], 1),
        );
      } else {
        return false;
      }
    }
    return true;
  }
}
