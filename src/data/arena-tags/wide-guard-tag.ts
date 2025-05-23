import { ConditionalProtectTag } from "#arena-tags/conditional-protect-tag";
import { allMoves } from "#data/data-lists";
import type { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { MoveId } from "#enums/move-id";
import { MoveTarget } from "#enums/move-target";
import type { ProtectConditionFunc } from "#types/protect-condition-func";

/**
 * Condition function for {@link https://bulbapedia.bulbagarden.net/wiki/Wide_Guard_(move) Wide Guard's}
 * protection effect.
 * @param _arena {@linkcode Arena} The arena containing the protection effect
 * @param moveId {@linkcode MoveId} The move to check against this condition
 * @returns `true` if the incoming move is multi-targeted (even if it's only used against one Pokemon).
 */
const WideGuardConditionFunc: ProtectConditionFunc = (_arena, moveId): boolean => {
  const move = allMoves.get(moveId);

  switch (move.moveTarget) {
    case MoveTarget.ALL_ENEMIES:
    case MoveTarget.ALL_NEAR_ENEMIES:
    case MoveTarget.ALL_OTHERS:
    case MoveTarget.ALL_NEAR_OTHERS:
      return true;
  }
  return false;
};

/**
 * Arena Tag class for {@link https://bulbapedia.bulbagarden.net/wiki/Wide_Guard_(move) Wide Guard}.
 * *Condition:* The incoming move can target multiple Pokemon. The move's source
 * can be an ally or enemy.
 * @extends ConditionalProtectTag
 */
export class WideGuardTag extends ConditionalProtectTag {
  constructor(sourceId: number, side: ArenaTagSide) {
    super(ArenaTagType.WIDE_GUARD, MoveId.WIDE_GUARD, sourceId, side, WideGuardConditionFunc);
  }
}
