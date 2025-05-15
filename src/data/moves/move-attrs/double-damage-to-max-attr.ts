import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveAttr } from "#moves/move-attr";
import type { NumberHolder } from "#utils/common-utils";

export class DoubleDamageToMaxAttr extends MoveAttr {
  /**
   * Whether or not to set a move to do double damage if the target is a G-Max Pokemon (except Eternamax)
   * @param _user the {@linkcode Pokemon} using the move
   * @param target the {@linkcode Pokemon} targeted by the move
   * @param _move the {@linkcode Move} being used
   * @param doDoubleDamage a {@linkcode BooleanHolder} containing a flag which, if set to `true`, marks
   * the current attack to do double damage
   * @returns `true` if the move should deal double damage, `false` otherwise
   */
  override apply(_user: Pokemon, target: Pokemon, _move: Move, damage: NumberHolder): boolean {
    if (target.isMax(false)) {
      damage.value *= 2;
      return true;
    }
    return false;
  }
}
