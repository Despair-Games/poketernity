import { BATTLE_STATS } from "#enums/stat";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

/**
 * Attribute to increase a random stat on the user by 2 stages.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Acupressure_(move) Acupressure}.
 * @extends MoveEffectAttr
 */
export class AcupressureStatStageChangeAttr extends MoveEffectAttr {
  constructor() {
    super();
  }

  override apply(user: Pokemon, target: Pokemon, _move: Move): boolean {
    const randStats = BATTLE_STATS.filter((s) => target.getStatStage(s) < 6);
    if (randStats.length > 0) {
      const boostStat = [randStats[user.randSeedInt(randStats.length)]];
      globalScene.unshiftPhase(new StatStageChangePhase(target.getBattlerIndex(), this.selfTarget, boostStat, 2));
      return true;
    }
    return false;
  }
}
