import type { MoveId } from "#enums/move-id";
import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/moves/move";
import { MoveAttr } from "#app/data/moves/move-attrs/move-attr";
import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";

/**
 * Attribute implementing {@link https://bulbapedia.bulbagarden.net/wiki/Last_Resort_(move) | Last Resort}'s
 * condition for use.
 * The move can only be used after the user has used all other
 * moves in its moveset since it entered the field.
 * @extends MoveAttr
 */
export class LastResortAttr extends MoveAttr {
  override getCondition(): MoveConditionFunc {
    return (user: Pokemon, _target: Pokemon, move: Move) => {
      const uniqueUsedMoveIds = new Set<MoveId>();
      const movesetMoveIds = user.getMoveset().map((m) => m.moveId);
      user.getMoveHistory().map((m) => {
        if (m.move.id !== move.id && movesetMoveIds.find((mm) => mm === m.move.id)) {
          uniqueUsedMoveIds.add(m.move.id);
        }
      });
      return uniqueUsedMoveIds.size >= movesetMoveIds.length - 1;
    };
  }
}
