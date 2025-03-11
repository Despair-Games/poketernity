import { allMoves } from "#app/data/data-lists";
import { MoveTarget } from "#enums/move-target";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { MoveId } from "#enums/move-id";
import { AbAttr } from "./ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";

export class RedirectMoveAbAttr extends AbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(AbAttrFlag.REDIRECT_MOVE);
  }

  override apply(pokemon: Pokemon, _simulated: boolean, moveId: MoveId, target: NumberHolder): boolean {
    if (this.canRedirect(moveId)) {
      const newTarget = pokemon.getBattlerIndex();
      if (target.value !== newTarget) {
        target.value = newTarget;
        return true;
      }
    }

    return false;
  }

  canRedirect(moveId: MoveId): boolean {
    const move = allMoves.get(moveId);
    return !![MoveTarget.NEAR_OTHER, MoveTarget.OTHER].find((t) => move.moveTarget === t);
  }
}
