import { allMoves } from "#app/data/all-moves";
import { type Move } from "#app/data/move";
import { CallMoveAttr } from "#app/data/move-attrs/call-move-attr";
import { type Pokemon } from "#app/field/pokemon";
import { getEnumValues, type BooleanHolder } from "#app/utils";
import { Moves } from "#enums/moves";

/**
 * Attribute used to call a random move.
 * Used for {@linkcode Moves.METRONOME}
 * @see {@linkcode apply} for move selection and move call
 * @extends CallMoveAttr to call a selected move
 */
export class RandomMoveAttr extends CallMoveAttr {
  constructor(invalidMoves: Moves[]) {
    super();
    this.invalidMoves = invalidMoves;
  }

  /**
   * This function exists solely to allow tests to override the randomly selected move by mocking this function.
   */
  public getMoveOverride(): Moves | null {
    return null;
  }

  /**
   * User calls a random moveId.
   *
   * Invalid moves are indicated by what is passed in to invalidMoves: {@linkcode invalidMetronomeMoves}
   * @param user Pokemon that used the move and will call a random move
   * @param target Pokemon that will be targeted by the random move (if single target)
   * @param move Move being used
   * @param args Unused
   */
  override apply(user: Pokemon, target: Pokemon, _move: Move, overridden: BooleanHolder): boolean {
    const moveIds = getEnumValues(Moves).map((m) =>
      !this.invalidMoves.includes(m) && !allMoves[m].name.endsWith(" (N)") ? m : Moves.NONE,
    );

    let moveId: Moves = Moves.NONE;
    do {
      moveId = this.getMoveOverride() ?? moveIds[user.randSeedInt(moveIds.length)];
    } while (moveId === Moves.NONE);

    return super.apply(user, target, allMoves[moveId], overridden);
  }
}
