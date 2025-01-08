import { allMoves } from "#app/data/all-moves";
import { type Move } from "#app/data/move";
import { CallMoveAttr } from "#app/data/move-attrs/call-move-attr";
import { type MoveConditionFunc } from "#app/data/move-conditions";
import { type Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { BooleanHolder } from "#app/utils";
import type { Moves } from "#enums/moves";

/**
 * Attribute used to copy a previously-used move.
 * Used for {@linkcode Moves.COPYCAT} and {@linkcode Moves.MIRROR_MOVE}
 * @see {@linkcode apply} for move selection and move call
 * @extends CallMoveAttr
 */
export class CopyMoveAttr extends CallMoveAttr {
  private mirrorMove: boolean;

  constructor(mirrorMove: boolean, invalidMoves: Moves[] = []) {
    super();
    this.mirrorMove = mirrorMove;
    this.invalidMoves = invalidMoves;
  }

  override apply(user: Pokemon, target: Pokemon, _move: Move, overridden: BooleanHolder): boolean {
    this.hasTarget = this.mirrorMove;
    const lastMove = this.mirrorMove ? target.getLastXMoves()[0].move : globalScene.currentBattle.lastMove;
    return super.apply(user, target, allMoves[lastMove], overridden);
  }

  override getCondition(): MoveConditionFunc {
    return (_user, target, _move) => {
      if (this.mirrorMove) {
        return target.getMoveHistory().length !== 0;
      } else {
        const lastMove = globalScene.currentBattle.lastMove;
        return lastMove !== undefined && !this.invalidMoves.includes(lastMove);
      }
    };
  }
}
