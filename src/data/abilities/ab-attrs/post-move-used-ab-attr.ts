import { AbAttr } from "#abilities/ab-attr";
import type { PostMoveUsedAbAttrParams } from "#types/ab-attr-param-types";

/** Triggers just after a move is used either by the opponent or the player */
export abstract class PostMoveUsedAbAttr extends AbAttr {
  protected override readonly abAttrKey = "PostMoveUsedAbAttr";

  constructor() {
    super(true);
  }

  public abstract override apply(params: PostMoveUsedAbAttrParams): void;
}
