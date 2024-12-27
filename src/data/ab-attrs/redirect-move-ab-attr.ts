import { allMoves } from "#app/data/all-moves";
import { MoveTarget } from "../../enums/move-target";
import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder, NumberHolder } from "#app/utils";
import type { Moves } from "#enums/moves";
import { AbAttr } from "./ab-attr";

export class RedirectMoveAbAttr extends AbAttr {
  override apply(
    pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    const move: Moves = args[0];
    if (this.canRedirect(move)) {
      const target = args[1] as NumberHolder;
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
