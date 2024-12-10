import type Pokemon from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import { type Move, MoveTarget } from "../move";
import { PreDefendAbAttr } from "./pre-defend-ab-attr";

export class FieldPriorityMoveImmunityAbAttr extends PreDefendAbAttr {
  override applyPreDefend(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    attacker: Pokemon,
    move: Move,
    cancelled: BooleanHolder,
    _args: any[],
  ): boolean {
    if (move.moveTarget === MoveTarget.USER || move.moveTarget === MoveTarget.NEAR_ALLY) {
      return false;
    }

    if (move.getPriority(attacker) > 0 && !move.isMultiTarget()) {
      cancelled.value = true;
      return true;
    }

    return false;
  }
}
