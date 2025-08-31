import {
  DRASTIC_EFFECT_SCORE_PENALTY,
  FAVORABLE_MATCHUP_SCORE_THRESHOLD,
  MINOR_EFFECT_SCORE_PENALTY,
} from "#constants/ai-constants";
import { HitResult } from "#enums/hit-result";
import { MoveEffectTrigger } from "#enums/move-effect-trigger";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";

/**
 * Attribute used for moves which self KO the user regardless if the move hits a target
 */
export class SacrificialAttr extends MoveEffectAttr {
  constructor(onHit: boolean = false) {
    super(true, { trigger: onHit ? MoveEffectTrigger.POST_APPLY : MoveEffectTrigger.POST_TARGET });
  }

  public override applyEffect(user: Pokemon, _target: Pokemon, _move: Move): boolean {
    user.damageAndUpdate(user.hp, {
      result: HitResult.SELF_KO,
      ignoreSegments: true,
      preventEndure: true,
    });

    return true;
  }

  /**
   * @returns A penalty corresponding to the user's perceived matchup against its opponents.
   * If the user's average MUS is below the {@linkcode FAVORABLE_MATCHUP_SCORE_THRESHOLD},
   * this grants a {@linkcode MINOR_EFFECT_SCORE_PENALTY}. Otherwise, this grants a
   * {@linkcode DRASTIC_EFFECT_SCORE_PENALTY}. Boss Pokemon are always granted
   * a (-20) penalty from this effect and therefore should virtually never use moves with it.
   */
  public override getEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    if (user.isBoss()) {
      return -20;
    }

    return user.getAverageMatchupScore() <= FAVORABLE_MATCHUP_SCORE_THRESHOLD
      ? MINOR_EFFECT_SCORE_PENALTY
      : DRASTIC_EFFECT_SCORE_PENALTY;
  }
}
