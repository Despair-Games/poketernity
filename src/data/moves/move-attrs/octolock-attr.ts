import { MINOR_EFFECT_SCORE_BONUS, STRONG_MATCHUP_SCORE_THRESHOLD } from "#constants/ai-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";

/**
 * Attribute to apply {@link https://bulbapedia.bulbagarden.net/wiki/Octolock_(move) | Octolock's}
 * effects. Traps the target and reduces the target's Defense
 * and Special Defense by one stage at the end of each turn.
 * @extends AddBattlerTagAttr
 */
export class OctolockAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.OCTOLOCK, false, { failOnOverlap: true });
  }

  /**
   * Grants a {@link MINOR_EFFECT_SCORE_BONUS | minor bonus} if the user has
   * a {@link STRONG_MATCHUP_SCORE_THRESHOLD | strong matchup} against all opponents.
   */
  public override getEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    if (user.getAverageMatchupScore() >= STRONG_MATCHUP_SCORE_THRESHOLD) {
      return MINOR_EFFECT_SCORE_BONUS;
    }
    return 0;
  }
}
