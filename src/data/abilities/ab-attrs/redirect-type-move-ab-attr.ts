import { RedirectMoveAbAttr } from "#abilities/redirect-move-ab-attr";
import type { Pokemon } from "#app/field/pokemon";
import { allMoves } from "#data/data-lists";
import type { ElementalType } from "#enums/elemental-type";
import type { MoveId } from "#enums/move-id";

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
