import { type Move } from "#app/data/moves/move";
import { MoveTarget } from "#enums/move-target";
import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import { PreDefendAbAttr } from "./pre-defend-ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";

export class FieldPriorityMoveImmunityAbAttr extends PreDefendAbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(AbAttrFlag.FIELD_PRIORITY_MOVE_IMMUNITY);
  }

  override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    attacker: Pokemon,
    move: Move,
    cancelled: BooleanHolder,
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
