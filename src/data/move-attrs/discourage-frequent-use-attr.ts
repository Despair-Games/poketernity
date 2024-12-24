import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/move";
import { MoveAttr } from "#app/data/move-attrs/move-attr";

export class DiscourageFrequentUseAttr extends MoveAttr {
  override getUserBenefitScore(user: Pokemon, _target: Pokemon, move: Move): number {
    const lastMoves = user.getLastXMoves(4);
    console.log(lastMoves);
    for (let m = 0; m < lastMoves.length; m++) {
      if (lastMoves[m].move === move.id) {
        return (4 - (m + 1)) * -10;
      }
    }

    return 0;
  }
}
