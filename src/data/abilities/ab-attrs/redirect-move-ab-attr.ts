import { AbAttr } from "#abilities/ab-attr";
import { allMoves } from "#data/data-lists";
import { MoveTarget } from "#enums/move-target";
import type { RedirectMoveAbAttrParams } from "#types/ab-attr-param-types";

export class RedirectMoveAbAttr extends AbAttr {
  protected override readonly abAttrKey = "RedirectMoveAbAttr";

  public override apply({ pokemon, target }: RedirectMoveAbAttrParams): void {
    const newTarget = pokemon.getBattlerIndex();
    if (target.value !== newTarget) {
      target.value = newTarget;
    }
  }

  public override canApply({ moveId }: Parameters<this["apply"]>[0]): boolean {
    const move = allMoves.get(moveId);
    return ([MoveTarget.NEAR_OTHER, MoveTarget.OTHER] as readonly MoveTarget[]).includes(move.moveTarget);
  }
}
