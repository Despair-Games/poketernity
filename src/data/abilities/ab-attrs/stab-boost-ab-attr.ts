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
import { ElementalType } from "#enums/elemental-type";

/**
 * Increases the STAB multiplier by `+0.5` if the move type is the same as one of the pokemon's types.
 * If the Pokemon is terastallized, then the STAB multiplier is only applied if the move type is the same as the tera type.
 * The total STAB multiplier is capped at `2.25`.
 *
 * Used for the {@linkcode AbilityId.ADAPTABILITY | Adaptability} ability.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Adaptability_(Ability) | Adaptability (Ability) - Bulbapedia}
 * @see {@link https://github.com/Despair-Games/poketernity/blob/61cb4baeae5be3c65969f6a428b0fb0757414267/docs/stab.md | stab.md#stab-table}
 */
export class StabBoostAbAttr extends AbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(AbAttrFlag.STAB_BOOST);
  }

  /**
   * @param pokemon - The {@linkcode Pokemon} with this ability
   * @param _simulated - n/a
   * @param move - The {@linkcode Move} being used
   * @param stabMultiplier - A {@linkcode NumberHolder} containing the move's STAB multiplier for the current attack
   * @returns `true` if the STAB multiplier was increased
   */
  override apply(pokemon: Pokemon, _simulated: boolean, move: Move, stabMultiplier: NumberHolder): boolean {
    // Adaptability does not apply to Stellar-type moves
    if (pokemon.getMoveType(move) === ElementalType.STELLAR) {
      return false;
    }

    const initialStabMultiplier = stabMultiplier.value;

    if (pokemon.isTerastallized) {
      if (pokemon.getTypes().includes(pokemon.teraType) && pokemon.teraType === pokemon.getMoveType(move)) {
        // If the tera type is one of the pokemon's original types then the STAB multiplier is increased by 0.25 (to 2.25)
        stabMultiplier.value += 0.25;
      } else if (pokemon.teraType === pokemon.getMoveType(move)) {
        // if the tera type is NOT one of the pokemon's original types but is the same as the move type then the STAB multiplier is increased by 0.5
        stabMultiplier.value += 0.5;
      }
    } else if (pokemon.getTypes().includes(pokemon.getMoveType(move))) {
      // If the move type is one of the pokemon's original types then the STAB multiplier is increased by 0.5
      stabMultiplier.value += 0.5;
    }

    return initialStabMultiplier !== stabMultiplier.value;
  }
}
