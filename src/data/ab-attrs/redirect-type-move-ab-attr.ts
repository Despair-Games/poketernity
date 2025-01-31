import { allMoves } from "#app/data/all-moves";
import type { Moves } from "#enums/moves";
import type { ElementType } from "#enums/element-type";
import { RedirectMoveAbAttr } from "./redirect-move-ab-attr";

export class RedirectTypeMoveAbAttr extends RedirectMoveAbAttr {
  public readonly type: ElementType;

  constructor(type: ElementType) {
    super();
    this.type = type;
  }

  override canRedirect(moveId: Moves): boolean {
    return super.canRedirect(moveId) && allMoves[moveId].type === this.type;
  }
}
