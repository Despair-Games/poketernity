import { AbAttr } from "#abilities/ab-attr";
import { allMoves } from "#data/data-lists";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { MoveId } from "#enums/move-id";
import { MoveTarget } from "#enums/move-target";
import type { Pokemon } from "#field/pokemon";
import type { NumberHolder } from "#utils/common-utils";

export class RedirectMoveAbAttr extends AbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(AbAttrFlag.REDIRECT_MOVE);
  }

  override apply(pokemon: Pokemon, _simulated: boolean, moveId: MoveId, user: Pokemon, target: NumberHolder): boolean {
    if (this.canRedirect(moveId, user)) {
      const newTarget = pokemon.getBattlerIndex();
      if (target.value !== newTarget) {
        target.value = newTarget;
        return true;
      }
    }

    return false;
  }

  canRedirect(moveId: MoveId, _user: Pokemon): boolean {
    const move = allMoves.get(moveId);
    return [MoveTarget.NEAR_OTHER, MoveTarget.OTHER].includes(move.moveTarget);
  }
}
