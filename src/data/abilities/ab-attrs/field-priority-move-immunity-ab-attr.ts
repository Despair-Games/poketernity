import { PreDefendAbAttr } from "#abilities/pre-defend-ab-attr";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { ValueHolder } from "#utils/common-utils";

export class FieldPriorityMoveImmunityAbAttr extends PreDefendAbAttr {
  protected override readonly abAttrKey = "FieldPriorityMoveImmunityAbAttr";

  constructor() {
    super(true);
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
