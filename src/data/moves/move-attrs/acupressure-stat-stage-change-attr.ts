import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { StatStageChangeMultiplierAbAttr } from "#abilities/stat-stage-change-multiplier-ab-attr";
import { globalScene } from "#app/global-scene";
import { BAD_MOVE_PENALTY, MINOR_EFFECT_SCORE_BONUS } from "#constants/ai-constants";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { BATTLE_STATS } from "#enums/stat";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import { ValueHolder } from "#utils/common-utils";

/**
 * Attribute to increase a random stat on the user by 2 stages.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Acupressure_(move) | Acupressure}.
 */
export class AcupressureStatStageChangeAttr extends MoveEffectAttr {
  public override applyEffect(user: Pokemon, target: Pokemon, _move: Move): boolean {
    const randStats = BATTLE_STATS.filter((s) => target.getStatStage(s) < 6);
    if (randStats.length > 0) {
      const boostStat = [randStats[user.randSeedInt(randStats.length)]];
      globalScene.phaseManager.createAndUnshiftPhase(
        "StatStageChangePhase",
        target.getBattlerIndex(),
        user,
        boostStat,
        2,
      );
      return true;
    }
    return false;
  }

  /**
   * @returns 75%(+1) if the target is projected to gain stats from this effect (i.e. the
   * target doesn't have Contrary). Otherwise, this grants a {@linkcode BAD_MOVE_PENALTY}
   */
  public override getEffectScore(user: EnemyPokemon, target: Pokemon, _move: Move): number {
    const statGain = this.getProjectedStatGain(target);
    if (statGain <= 0) {
      return BAD_MOVE_PENALTY;
    }

    return this.getRandomScore(user, 75);
  }

  /** @returns The output of {@linkcode getEffectScore} with an additional {@linkcode MINOR_EFFECT_SCORE_BONUS} */
  public override getAllyTargetScore(user: EnemyPokemon, target: EnemyPokemon, move: Move): number {
    return this.getEffectScore(user, target, move) + MINOR_EFFECT_SCORE_BONUS;
  }

  /**
   * @param target - The {@linkcode Pokemon} to be targeted by this effect
   * @returns The projected number of stat stages the target will gain from this effect, accounting for
   * multipliers such as Simple and Contrary.
   */
  private getProjectedStatGain(target: Pokemon): number {
    const statGain = new ValueHolder(2);
    applyAbAttrs<StatStageChangeMultiplierAbAttr>(AbAttrFlag.STAT_STAGE_CHANGE_MULTIPLIER, target, true, statGain);

    return statGain.value;
  }
}
