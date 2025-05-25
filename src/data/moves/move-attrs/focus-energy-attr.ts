import { MINOR_EFFECT_SCORE_BONUS } from "#constants/ai-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import { HighCritAttr } from "#moves/high-crit-attr";
import type { Move } from "#moves/move";

/**
 * Attribute for the effects of {@link https://bulbapedia.bulbagarden.net/wiki/Focus_Energy_(move) | Focus Energy}.
 * Increases the user's critical hit ratio by 2 stages.
 * @extends AddBattlerTagAttr
 */
export class FocusEnergyAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.CRIT_BOOST, true, { failOnOverlap: true });
  }

  /**
   * Has a 50% chance to grant (+1).
   * Grants an additional (+1) if the user has a move with an increased critical hit ratio.
   */
  public override getRawEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    const userHasHighCritMove = user.getMoveset().some((mv) => mv.getMove().hasAttr(HighCritAttr));

    return this.getRandomScore(user, 50) + (userHasHighCritMove ? MINOR_EFFECT_SCORE_BONUS : 0);
  }
}
