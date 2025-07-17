import { MINOR_EFFECT_SCORE_BONUS, MINOR_EFFECT_SCORE_PENALTY } from "#constants/ai-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import { ElementalType } from "#enums/elemental-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";

/**
 * Attribute to "un-ground" the user or target. Ungrounded
 * Pokemon are immune to Ground-type moves and other ground-based effects.
 * @extends AddBattlerTagAttr
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Grounded | Grounded}
 */
export class FloatingAttr extends AddBattlerTagAttr {
  constructor(selfTarget: boolean = true, turnCount: number = 5) {
    super(BattlerTagType.FLOATING, selfTarget, {
      failOnOverlap: true,
      turnCountMin: turnCount,
    });
  }

  /**
   * If the affected Pokemon is already un-grounded, this contributes nothing to Effect Score.
   * Otherwise, this grants an Effect Score modifier based on the number of Ground-type opponents to the affected Pokemon:
   * - If the affected Pokemon is the user or its ally, this modifier is {@linkcode MINOR_EFFECT_SCORE_BONUS}
   * - If the affected Pokemon is an opponent of the user, this modifier is {@linkcode MINOR_EFFECT_SCORE_PENALTY}
   */
  public override getRawEffectScore(user: EnemyPokemon, target: Pokemon, _move: Move): number {
    const pokemon = this.selfTarget ? user : target;
    if (!pokemon.isGrounded()) {
      return 0;
    }

    const numGroundTypeOpponents = pokemon
      .getOpponents()
      .filter((opp) => opp.estimateAttackMoves().some((mv) => opp.getMoveType(mv) === ElementalType.GROUND)).length;

    return (pokemon.isOpponent(user) ? MINOR_EFFECT_SCORE_PENALTY : MINOR_EFFECT_SCORE_BONUS) * numGroundTypeOpponents;
  }
}
