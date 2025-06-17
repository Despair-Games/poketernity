import { ConditionalProtectTag } from "#arena-tags/conditional-protect-tag";
import { allMoves } from "#data/data-lists";
import type { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { MoveCategory } from "#enums/move-category";
import { MoveId } from "#enums/move-id";
import { MoveTarget } from "#enums/move-target";
import type { ProtectConditionFunc } from "#types/protect-condition-func";

/**
 * Condition function for {@link https://bulbapedia.bulbagarden.net/wiki/Crafty_Shield_(move) Crafty Shield's}
 * protection effect.
 * @param _arena {@linkcode Arena} The arena containing the protection effect
 * @param moveId {@linkcode MoveId} The move to check against this condition
 * @returns `true` if the incoming move is a Status move, is not a hazard, and does not target all
 * Pokemon or sides of the field.
 */
const CraftyShieldConditionFunc: ProtectConditionFunc = (_arena, moveId) => {
  const move = allMoves.get(moveId);
  return (
    move.category === MoveCategory.STATUS
    && move.moveTarget !== MoveTarget.ENEMY_SIDE
    && move.moveTarget !== MoveTarget.BOTH_SIDES
    && move.moveTarget !== MoveTarget.ALL
  );
};

/**
 * Arena Tag class for {@link https://bulbapedia.bulbagarden.net/wiki/Crafty_Shield_(move) Crafty Shield}.
 * *Condition:* The incoming move is a Status move, is not a hazard, and does
 * not target all Pokemon or sides of the field.
 */
export class CraftyShieldTag extends ConditionalProtectTag {
  constructor(sourceId: number, side: ArenaTagSide) {
    super(ArenaTagType.CRAFTY_SHIELD, MoveId.CRAFTY_SHIELD, sourceId, side, CraftyShieldConditionFunc, true);
  }
}
