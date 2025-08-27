import { ATTACK_SCORE_HP_THRESHOLD, BAD_MOVE_PENALTY } from "#constants/ai-constants";
import { HitResult } from "#enums/hit-result";
import type { BattleStat } from "#enums/stat";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { StatStageChangeAttr } from "#moves/stat-stage-change-attr";
import type { MoveConditionFunc } from "#types/move-types";
import { toDmgValue } from "#utils/common-utils";

/**
 * Attribute to grant a stat stage boost to the user
 * at the cost of a portion of the user's maximum HP.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Belly_Drum_(move) | Belly Drum}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Clangorous_Soul_(move) | Clangorous Soul}.
 */
export class CutHpStatStageBoostAttr extends StatStageChangeAttr {
  private cutRatio: number;
  private messageCallback: ((user: Pokemon) => void) | undefined;

  constructor(
    stat: BattleStat[],
    levels: number,
    cutRatio: number,
    messageCallback?: ((user: Pokemon) => void) | undefined,
  ) {
    super(stat, levels, true);

    this.cutRatio = cutRatio;
    this.messageCallback = messageCallback;
  }

  public override applyEffect(user: Pokemon, target: Pokemon, move: Move): boolean {
    user.damageAndUpdate(toDmgValue(user.getMaxHp() / this.cutRatio), {
      result: HitResult.OTHER,
      ignoreSegments: true,
    });
    user.updateInfo();
    const ret = super.applyEffect(user, target, move);
    if (this.messageCallback) {
      this.messageCallback(user);
    }
    return ret;
  }

  public override getCondition(): MoveConditionFunc {
    return (user, _target, _move) =>
      user.getHpRatio() > 1 / this.cutRatio && this.stats.some((s) => user.getStatStage(s) < 6);
  }

  /**
   * @returns An additional penalty for reducing the user's HP to go with the score
   * for this effect's stat stage changes. This checks each of the user's opponents'
   * max {@link Pokemon.getExpectedAttackScore | EAS} among their estimated attacks
   * to predict how much damage the user will receive this turn. If the user is
   * projected to receive more damage than the effect's {@linkcode cutRatio}, this
   * grants a {@linkcode BAD_MOVE_PENALTY}.
   */
  public override getRawEffectScore(user: EnemyPokemon, target: Pokemon, move: Move): number {
    const oppMaxEas = user.getOpponents().map((opp) =>
      opp.estimateAttackMoves().reduce((maxEas, move) => {
        const eas = opp.getExpectedAttackScore(user, move);

        return Math.max(maxEas, eas);
      }, 0),
    );

    const meetsHpCutThreshold = oppMaxEas.every(
      (eas) => eas < ((user.getHpRatio() - 1 / this.cutRatio) * 100) / ATTACK_SCORE_HP_THRESHOLD,
    );
    const hpCutPenalty = meetsHpCutThreshold ? 0 : BAD_MOVE_PENALTY;

    return hpCutPenalty + super.getRawEffectScore(user, target, move);
  }
}
