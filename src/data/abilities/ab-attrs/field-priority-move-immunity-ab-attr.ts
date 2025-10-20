import { PreDefendAbAttr } from "#abilities/pre-defend-ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { ValueHolder } from "#utils/common-utils";

export class FieldPriorityMoveImmunityAbAttr extends PreDefendAbAttr {
  constructor() {
    super(true);
    this._flags.add(AbAttrFlag.FIELD_PRIORITY_MOVE_IMMUNITY);
  }

  public override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _attacker: Pokemon,
    _move: Move,
    cancelled: ValueHolder<boolean>,
  ): void {
    cancelled.value = true;
  }

  public override canApply(...[, , attacker, move]: Parameters<this["apply"]>): boolean {
    return !move.isAllyTarget() && move.getPriority(attacker) > 0 && !move.isMultiTarget();
  }
}
