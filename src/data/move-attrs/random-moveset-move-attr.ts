import { allMoves } from "#app/data/all-moves";
import { type Move } from "#app/data/move";
import { CallMoveAttr } from "#app/data/move-attrs/call-move-attr";
import type { MoveConditionFunc } from "#app/data/move-conditions";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { BooleanHolder } from "#app/utils";
import type { Moves } from "#enums/moves";

/**
 * Attribute used to call a random move in the user or party's moveset.
 * Used for {@linkcode Moves.ASSIST} and {@linkcode Moves.SLEEP_TALK}
 *
 * Fails if the user has no callable moves.
 * @extends RandomMoveAttr
 * @see {@linkcode getCondition} for move selection
 */
export class RandomMovesetMoveAttr extends CallMoveAttr {
  private includeParty: boolean;
  private moveId: number;

  constructor(invalidMoves: Moves[], includeParty: boolean = false) {
    super();
    this.includeParty = includeParty;
    this.invalidMoves = invalidMoves;
  }

  /**
   * User calls a random moveId selected in {@linkcode getCondition}
   * @param user Pokemon that used the move and will call a random move
   * @param target Pokemon that will be targeted by the random move (if single target)
   * @param move Move being used
   * @param args Unused
   */
  override apply(user: Pokemon, target: Pokemon, _move: Move, overridden: BooleanHolder): boolean {
    return super.apply(user, target, allMoves[this.moveId], overridden);
  }

  override getCondition(): MoveConditionFunc {
    return (user, _target, _move) => {
      // includeParty will be true for Assist, false for Sleep Talk
      let allies: Pokemon[];
      if (this.includeParty) {
        allies = user.isPlayer()
          ? globalScene.getPlayerParty().filter((p) => p !== user)
          : globalScene.getEnemyParty().filter((p) => p !== user);
      } else {
        allies = [user];
      }

      const partyMoveset = allies.map((p) => p.moveset).flat();
      const moves = partyMoveset.filter(
        (m) => !this.invalidMoves.includes(m.moveId) && !m.getMove().name.endsWith(" (N)"),
      );

      if (moves.length === 0) {
        return false;
      }

      this.moveId = moves[user.randSeedInt(moves.length)].moveId;
      return true;
    };
  }
}
