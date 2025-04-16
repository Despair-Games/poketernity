// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { AbilityId } from "#enums/ability-id";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

import { AbAttr } from "#app/data/abilities/ab-attrs/ab-attr";
import type { Move } from "#app/data/moves/move";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";

/**
 * Applies a STAB multiplier boost of `0.5` if the move type is the same as one of the pokemon's types
 * unless the pokemon is terastallized. Then the STAB multiplier is only applied if the move type is the same as the tera type.
 * Used for the {@linkcode AbilityId.ADAPTABILITY Adaptability} ability.
 * @param pokemon The {@linkcode Pokemon} with this ability
 * @param _simulated n/a
 * @param move the {@linkcode Move} being used
 * @param stabMultiplier a {@linkcode NumberHolder} containing the move's STAB multiplier for the current attack
 * @returns `true` if the STAB multiplier was increased
 */
export class StabBoostAbAttr extends AbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(AbAttrFlag.STAB_BOOST);
  }

  override apply(pokemon: Pokemon, _simulated: boolean, move: Move, stabMultiplier: NumberHolder): boolean {
    if (pokemon.getTypes().includes(move.type)) {
      if (pokemon.isTerastallized()) {
        const moveType = move.type;
        const teraType = pokemon.getTeraType();

        if (moveType === teraType) {
          stabMultiplier.value += 0.5; // Adaptability only applies if the move type is the same as the tera type (When the pokemon is terastallized)
          return true;
        }
      } else {
        stabMultiplier.value += 0.5;
        return true;
      }
    }

    return false;
  }
}
