import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/moves/move";
import { MoveAttr } from "#app/data/moves/move-attrs/move-attr";
import type { BooleanHolder } from "#app/utils/common-utils";

/**
 * Attribute to apply STAB to the given {@link https://bulbapedia.bulbagarden.net/wiki/Move_variations#Pledge_moves | Pledge move}
 * when combined with another unique Pledge move.
 */
export class CombinedPledgeStabBoostAttr extends MoveAttr {
  /**
   * Sets the given move's STAB multiplier to 1.5 when the move is combined with a different Pledge move
   * @param user the {@linkcode Pokemon} using the move
   * @param _target the {@linkcode Pokemon} targeted by the move
   * @param move the {@linkcode Move} being used
   * @param appliesStab a {@linkcode BooleanHolder} containing wheter the STAB boost, for the current attack should, be applied
   * @returns `true` if the STAB multiplier is modified
   */
  override apply(user: Pokemon, _target: Pokemon, move: Move, appliesStab: BooleanHolder): boolean {
    const combinedPledgeMove = user.turnData.combiningPledge;

    if (combinedPledgeMove && combinedPledgeMove !== move.id) {
      appliesStab.value = true;
      return true;
    }
    return false;
  }
}
