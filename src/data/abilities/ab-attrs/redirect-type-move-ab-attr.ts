import { RedirectMoveAbAttr } from "#abilities/redirect-move-ab-attr";
import { allMoves } from "#data/data-lists";
import type { ElementalType } from "#enums/elemental-type";
import type { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";

export class RedirectTypeMoveAbAttr extends RedirectMoveAbAttr {
  public readonly type: ElementalType;

  constructor(type: ElementalType) {
    super();
    this.type = type;
  }

  override canRedirect(moveId: MoveId, user: Pokemon): boolean {
    return super.canRedirect(moveId, user) && user.getMoveType(allMoves.get(moveId)) === this.type;
  }
}
