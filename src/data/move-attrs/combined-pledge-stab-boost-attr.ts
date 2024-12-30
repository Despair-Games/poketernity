import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { MoveAttr } from "#app/data/move-attrs/move-attr";

/**
 * Applies STAB to the given Pledge move if the move is part of a combined attack.
 */
export class CombinedPledgeStabBoostAttr extends MoveAttr {
  override apply(user: Pokemon, _target: Pokemon, move: Move, stabMultiplier: NumberHolder): boolean {
    const combinedPledgeMove = user.turnData.combiningPledge;

    if (combinedPledgeMove && combinedPledgeMove !== move.id) {
      stabMultiplier.value = 1.5;
      return true;
    }
    return false;
  }
}
