import { allMoves } from "#app/data/all-moves";
import { MoveTarget } from "#enums/move-target";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Moves } from "#enums/moves";
import { AbAttr } from "./ab-attr";

export class RedirectMoveAbAttr extends AbAttr {
  override apply(pokemon: Pokemon, _passive: boolean, _simulated: boolean, move: Moves, target: NumberHolder): boolean {
    if (this.canRedirect(move)) {
      const newTarget = pokemon.getBattlerIndex();
      if (target.value !== newTarget) {
        target.value = newTarget;
        return true;
      }
    }

    return false;
  }

  canRedirect(moveId: Moves): boolean {
    const move = allMoves[moveId];
    return !![MoveTarget.NEAR_OTHER, MoveTarget.OTHER].find((t) => move.moveTarget === t);
  }
}
