import type Pokemon from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import { EFFECTIVE_STATS } from "#enums/stat";
import { PostTurnAbAttr } from "./post-turn-ab-attr";

/**
 * Attribute used for {@linkcode Abilities.MOODY}
 */
export class MoodyAbAttr extends PostTurnAbAttr {
  constructor() {
    super(true);
  }
  /**
   * Randomly increases one stat stage by 2 and decreases a different stat stage by 1
   * @param {Pokemon} pokemon Pokemon that has this ability
   * @param _passive N/A
   * @param simulated true if applying in a simulated call.
   * @param _args N/A
   * @returns true
   *
   * Any stat stages at +6 or -6 are excluded from being increased or decreased, respectively
   * If the pokemon already has all stat stages raised to 6, it will only decrease one stat stage by 1
   * If the pokemon already has all stat stages lowered to -6, it will only increase one stat stage by 2
   */
  override applyPostTurn(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    const canRaise = EFFECTIVE_STATS.filter((s) => pokemon.getStatStage(s) < 6);
    let canLower = EFFECTIVE_STATS.filter((s) => pokemon.getStatStage(s) > -6);

    if (!simulated) {
      if (canRaise.length > 0) {
        const raisedStat = canRaise[pokemon.randSeedInt(canRaise.length)];
        canLower = canRaise.filter((s) => s !== raisedStat);
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