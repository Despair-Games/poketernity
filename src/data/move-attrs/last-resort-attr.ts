import type { Moves } from "#enums/moves";
import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/move";
import { MoveAttr } from "#app/data/move-attrs/move-attr";
import type { MoveConditionFunc } from "../move-conditions";

/**
 * Attribute implementing {@link https://bulbapedia.bulbagarden.net/wiki/Last_Resort_(move) Last Resort}'s
 * condition for use.
 * The move can only be used after the user has used all other
 * moves in its moveset since it entered the field.
 * @extends MoveAttr
 */
export class LastResortAttr extends MoveAttr {
  override getCondition(): MoveConditionFunc {
    return (user: Pokemon, _target: Pokemon, move: Move) => {
      const uniqueUsedMoveIds = new Set<Moves>();
      const movesetMoveIds = user.getMoveset().map((m) => m.moveId);
      user.getMoveHistory().map((m) => {
        if (m.move !== move.id && movesetMoveIds.find((mm) => mm === m.move)) {
          uniqueUsedMoveIds.add(m.move);
        }
      });
      return uniqueUsedMoveIds.size >= movesetMoveIds.length - 1;
    };
  }
}
