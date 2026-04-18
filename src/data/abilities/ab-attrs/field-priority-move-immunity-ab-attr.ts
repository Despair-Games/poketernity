import { PreDefendAbAttr } from "#abilities/pre-defend-ab-attr";
import type { FieldPriorityMoveImmunityAbAttrParams } from "#types/ab-attr-param-types";

export class FieldPriorityMoveImmunityAbAttr extends PreDefendAbAttr {
  protected override readonly abAttrKey = "FieldPriorityMoveImmunityAbAttr";

  constructor() {
    super(true);
  }

  public override apply({ cancelled }: FieldPriorityMoveImmunityAbAttrParams): void {
    cancelled.value = true;
  }

  public override canApply({ attacker, move }: Parameters<this["apply"]>[0]): boolean {
    return !move.isAllyTarget() && move.getPriority(attacker) > 0 && !move.isMultiTarget();
  }
}
