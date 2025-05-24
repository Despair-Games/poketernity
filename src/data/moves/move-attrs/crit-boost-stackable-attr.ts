import { MINOR_EFFECT_SCORE_BONUS } from "#constants/ai-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import { HighCritAttr } from "#moves/high-crit-attr";
import type { Move } from "#moves/move";

/**
 * Attribute to apply {@link https://bulbapedia.bulbagarden.net/wiki/G-Max_Chi_Strike_(move) | G-Max Chi Strike's}
 * secondary effect. Increases the user's critical hit ratio by 1 stage.
 * Unlike Focus Energy's effect, this effect may stack with itself.
 * @extends AddBattlerTagAttr
 */
export class CritBoostStackableAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.CRIT_BOOST_STACKABLE, true, {
      appliesScoreOnKO: true,
    });
  }

  /**
   * Has a 30% chance to grant (+1).
   * Grants an additional (+1) if the user has a move with an increased critical hit ratio
   */
  public override getEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    const userHasHighCritMove = user.getMoveset().some((mv) => mv.getMove().hasAttr(HighCritAttr));

    return this.getRandomScore(user, 30) + (userHasHighCritMove ? MINOR_EFFECT_SCORE_BONUS : 0);
  }
}
