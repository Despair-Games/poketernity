import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import { EFFECTIVE_STATS } from "#enums/stat";
import { PostTurnAbAttr } from "./post-turn-ab-attr";

/**
 * Attribute to randomly increase one stat stage by 2 and decrease a different
 * stat stage by 1. Any stat stage at +6 or -6 is excluded from being increased
 * or decreased, respectively.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Moody_(Ability) | Moody}.
 * @extends PostTurnAbAttr
 */
export class MoodyAbAttr extends PostTurnAbAttr {
  override apply(pokemon: Pokemon, simulated: boolean): boolean {
    const canRaise = EFFECTIVE_STATS.filter((s) => pokemon.getStatStage(s) < 6);
    let canLower = EFFECTIVE_STATS.filter((s) => pokemon.getStatStage(s) > -6);

    if (!simulated) {
      if (canRaise.length > 0) {
        const raisedStat = canRaise[pokemon.randSeedInt(canRaise.length)];
        canLower = canLower.filter((s) => s !== raisedStat);
        globalScene.unshiftPhase(new StatStageChangePhase(pokemon.getBattlerIndex(), true, [raisedStat], 2));
      }
      if (canLower.length > 0) {
        const loweredStat = canLower[pokemon.randSeedInt(canLower.length)];
        globalScene.unshiftPhase(new StatStageChangePhase(pokemon.getBattlerIndex(), true, [loweredStat], -1));
      }
    }

    return true;
  }
}
