import { STRONG_MATCHUP_SCORE_THRESHOLD } from "#constants/ai-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import { ElementalType } from "#enums/elemental-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";

/**
 * Attribute to apply {@link https://bulbapedia.bulbagarden.net/wiki/Ingrain_(move) | Ingrain's} effects
 * (other than grounding the user). Traps the user on the field
 * and causes them to heal 1/16th max HP each turn.
 * @extends AddBattlerTagAttr
 */
export class IngrainAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.INGRAIN, true, { failOnOverlap: true });
  }

  /**
   * Grants 55%(+1) if the user's average Matchup Score against all active opponents
   * is above the {@linkcode STRONG_MATCHUP_SCORE_THRESHOLD}. The bonus chance increases
   * to 75% if the user is also Ghost-type.
   */
  public override getEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    if (user.getAverageMatchupScore() >= STRONG_MATCHUP_SCORE_THRESHOLD) {
      const bonusChance = user.isOfType(ElementalType.GHOST, true, true) ? 75 : 55;
      return this.getRandomScore(user, bonusChance);
    }
    return 0;
  }
}
