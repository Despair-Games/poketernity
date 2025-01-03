import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { MoveAttr } from "#app/data/move-attrs/move-attr";

/**
 * Attribute to apply STAB to the given {@link https://bulbapedia.bulbagarden.net/wiki/Move_variations#Pledge_moves Pledge move}
 * when combined with another unique Pledge move.
 */
export class CombinedPledgeStabBoostAttr extends MoveAttr {
  /**
   * Sets the given move's STAB multiplier to 1.5 when the move is combined with a different Pledge move
   * @param user the {@linkcode Pokemon} using the move
   * @param _target the {@linkcode Pokemon} targeted by the move
   * @param move the {@linkcode Move} being used
   * @param stabMultiplier a {@linkcode NumberHolder} containing the move's STAB multiplier for the current attack
   * @returns `true` if the STAB multiplier is modified
   */
  override apply(user: Pokemon, _target: Pokemon, move: Move, stabMultiplier: NumberHolder): boolean {
    const combinedPledgeMove = user.turnData.combiningPledge;

    if (combinedPledgeMove && combinedPledgeMove !== move.id) {
      stabMultiplier.value = 1.5;
      return true;
    }
    return false;
  }
}
