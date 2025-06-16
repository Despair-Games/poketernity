import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveAttr } from "#moves/move-attr";

/**
 * Attribute to discourage Enemy AI from using
 * the associated move multiple times in a short interval.
 * Has no effect on game state.
 */
export class DiscourageFrequentUseAttr extends MoveAttr {
  override getUserBenefitScore(user: Pokemon, _target: Pokemon, move: Move): number {
    const lastMoves = user.getLastXMoves(4);
    console.log(lastMoves);
    for (let m = 0; m < lastMoves.length; m++) {
      if (lastMoves[m].move.id === move.id) {
        return (4 - (m + 1)) * -10;
      }
    }

    return 0;
  }
}
