import { type Move } from "#app/data/move";
import { MoveCategory } from "#enums/move-category";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import { PreDefendAbAttr } from "./pre-defend-ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";

/**
 * Reduces the accuracy of status moves used against the Pokémon with this ability to 50%.
 * Used by Wonder Skin.
 *
 * @extends PreDefendAbAttr
 */
export class WonderSkinAbAttr extends PreDefendAbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(AbAttrFlag.WONDER_SKIN);
  }

  override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _attacker: Pokemon,
    move: Move,
    moveAccuracy: NumberHolder,
  ): boolean {
    if (move.category === MoveCategory.STATUS && moveAccuracy.value >= 50) {
      moveAccuracy.value = 50;
      return true;
    }

    return false;
  }
}
