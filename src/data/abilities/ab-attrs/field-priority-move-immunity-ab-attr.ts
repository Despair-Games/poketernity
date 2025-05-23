import { PreDefendAbAttr } from "#abilities/pre-defend-ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { MoveTarget } from "#enums/move-target";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { BooleanHolder } from "#utils/common-utils";

export class FieldPriorityMoveImmunityAbAttr extends PreDefendAbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(AbAttrFlag.FIELD_PRIORITY_MOVE_IMMUNITY);
  }

  public override apply(
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
