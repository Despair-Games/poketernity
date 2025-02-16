import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import { type Move } from "#app/data/move";
import { CallMoveAttr } from "#app/data/move-attrs/call-move-attr";
import { type Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import type { MoveId } from "#enums/move-id";

/**
 * Attribute used to copy the last move used by the target.
 *
 * Used for {@linkcode MoveId.MIRROR_MOVE}
 * @see {@linkcode apply} for move selection and move call
 * @extends CallMoveAttr
 */
export class MirrorMoveAttr extends CallMoveAttr {
  constructor() {
    super();
    this.invalidMoves = invalidMirrorMoveMoves;
    this.hasTarget = true;
  }

  override apply(user: Pokemon, target: Pokemon, _move: Move, overridden: BooleanHolder): boolean {
    const lastMove = target.getLastXMoves()[0].move;
    return super.apply(user, target, lastMove, overridden);
  }

  override getCondition(): MoveConditionFunc {
    return (_user, target, _move) => {
      return target.getMoveHistory().length !== 0;
    };
  }
}

// TODO: populate list
const invalidMirrorMoveMoves: MoveId[] = [];
