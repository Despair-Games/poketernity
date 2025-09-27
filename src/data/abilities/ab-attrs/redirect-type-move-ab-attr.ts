import { RedirectMoveAbAttr } from "#abilities/redirect-move-ab-attr";
import { allMoves } from "#data/data-lists";
import type { ElementalType } from "#enums/elemental-type";

export class RedirectTypeMoveAbAttr extends RedirectMoveAbAttr {
  public readonly type: ElementalType;

  constructor(type: ElementalType) {
    super();
    this.type = type;
  }

  public override canApply(...params: Parameters<this["apply"]>): boolean {
    const [, , moveId, user] = params;
    const move = allMoves.get(moveId);
    return super.canApply(...params) && user.getMoveType(move) === this.type;
  }
}
