import { STRONG_MATCHUP_SCORE_THRESHOLD } from "#constants/ai-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";

/**
 * Attribute to apply {@link https://bulbapedia.bulbagarden.net/wiki/Aqua_Ring_(move) | Aqua Ring's}
 * effect. Restores 1/16th of the user's max HP at the end of each turn.
 * @extends AddBattlerTagAttr
 */
export class AquaRingAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.AQUA_RING, true, { failOnOverlap: true });
  }

  /**
   * Grants 75%(+1) if the user's average Matchup Score against all active opponents
   * is above the {@linkcode STRONG_MATCHUP_SCORE_THRESHOLD}.
   */
  public override getEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    if (user.getAverageMatchupScore() >= STRONG_MATCHUP_SCORE_THRESHOLD) {
      return this.getRandomScore(user, 75);
    }
    return 0;
  }
}
