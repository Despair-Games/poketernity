import type Pokemon from "#app/field/pokemon";
import type { BooleanHolder, NumberHolder } from "#app/utils";
import { type Move, MoveCategory } from "../move";
import { PreDefendAbAttr } from "./pre-defend-ab-attr";

/**
 * Reduces the accuracy of status moves used against the Pokémon with this ability to 50%.
 * Used by Wonder Skin.
 *
 * @extends PreDefendAbAttr
 */
export class WonderSkinAbAttr extends PreDefendAbAttr {
  override applyPreDefend(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _attacker: Pokemon,
    move: Move,
    _cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    const moveAccuracy = args[0] as NumberHolder;
    if (move.category === MoveCategory.STATUS && moveAccuracy.value >= 50) {
      moveAccuracy.value = 50;
      return true;
    }

    return false;
  }
}
