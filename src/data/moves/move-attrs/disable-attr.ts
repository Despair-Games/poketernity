import { MINOR_EFFECT_SCORE_BONUS } from "#constants/ai-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";

/**
 * Attribute for the effects of {@link https://bulbapedia.bulbagarden.net/wiki/Disable_(move) | Disable}.
 * Disables the target's last-used move for 4 turns.
 * @extends AddBattlerTagAttr
 */
export class DisableAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.DISABLED, false, { failOnOverlap: true });
  }

  /**
   * Grants (+1) (or +2 if the user is faster than the target) if the target's
   * last-used move has an {@linkcode Pokemon.getExpectedAttackScore | EAS}
   * higher than 1 (i.e. the move deals >40% max HP damage).
   */
  public override getRawEffectScore(user: EnemyPokemon, target: Pokemon, _move: Move): number {
    const lastTargetMove = target
      .getLastXMoves(-1)
      .find((m) => !m.virtual && ![MoveId.NONE, MoveId.STRUGGLE].includes(m.move.id))?.move;

    if (lastTargetMove && target.getExpectedAttackScore(user, lastTargetMove) > 1) {
      return MINOR_EFFECT_SCORE_BONUS + (user.outspeeds(target) ? MINOR_EFFECT_SCORE_BONUS : 0);
    }

    return 0;
  }
}
