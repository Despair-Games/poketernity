import { allMoves } from "#app/data/all-moves";
import type { MoveId } from "#enums/move-id";
import type { Type } from "#enums/type";
import { RedirectMoveAbAttr } from "./redirect-move-ab-attr";

export class RedirectTypeMoveAbAttr extends RedirectMoveAbAttr {
  public readonly type: Type;

  constructor(type: Type) {
    super();
    this.type = type;
  }

  override canRedirect(moveId: MoveId): boolean {
    return super.canRedirect(moveId) && allMoves[moveId].type === this.type;
  }
}
