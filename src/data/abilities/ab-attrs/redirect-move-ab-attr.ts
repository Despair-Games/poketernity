import { AbAttr } from "#abilities/ab-attr";
import { allMoves } from "#data/data-lists";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { MoveId } from "#enums/move-id";
import { MoveTarget } from "#enums/move-target";
import type { Pokemon } from "#field/pokemon";
import type { NumberHolder } from "#utils/common-utils";

export class RedirectMoveAbAttr extends AbAttr {
  constructor() {
    super();
    this._flags.add(AbAttrFlag.REDIRECT_MOVE);
  }

  public override apply(
    pokemon: Pokemon,
    _simulated: boolean,
    _moveId: MoveId,
    _user: Pokemon,
    target: NumberHolder,
  ): void {
    const newTarget = pokemon.getBattlerIndex();
    if (target.value !== newTarget) {
      target.value = newTarget;
    }
  }

  public override canApply(...[, , moveId]: Parameters<this["apply"]>): boolean {
    const move = allMoves.get(moveId);
    return ([MoveTarget.NEAR_OTHER, MoveTarget.OTHER] as readonly MoveTarget[]).includes(move.moveTarget);
  }
}
