import { globalScene } from "#app/global-scene";
import { BATTLE_STATS } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import { StatStageChangePhase } from "#phases/stat-stage-change-phase";

/**
 * Attribute to increase a random stat on the user by 2 stages.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Acupressure_(move) | Acupressure}.
 */
export class AcupressureStatStageChangeAttr extends MoveEffectAttr {
  override applyEffect(user: Pokemon, target: Pokemon, _move: Move): boolean {
    const randStats = BATTLE_STATS.filter((s) => target.getStatStage(s) < 6);
    if (randStats.length > 0) {
      const boostStat = [randStats[user.randSeedInt(randStats.length)]];
      globalScene.phaseManager.unshiftPhase(new StatStageChangePhase(target.getBattlerIndex(), user, boostStat, 2));
      return true;
    }
    return false;
  }
}
