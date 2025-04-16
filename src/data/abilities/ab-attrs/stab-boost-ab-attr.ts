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
 * @see https://bulbapedia.bulbagarden.net/wiki/Adaptability_(Ability)
 *
 * | User Type: | Tera Type | Move Type | Expected STAB w/ Adaptability |
 * |--------|--------|--------|--------|
 * | FIRE | - | WATER | 1.0 |
 * | FIRE | - | FIRE | 2.0 |
 * | FIRE | WATER | FIRE | 1.5 |
 * | FIRE | WATER | WATER | 2.0 |
 * | FIRE | FIRE | FIRE | 2.25 |
 */
export class StabBoostAbAttr extends AbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(AbAttrFlag.STAB_BOOST);
  }

  override apply(pokemon: Pokemon, _simulated: boolean, move: Move, stabMultiplier: NumberHolder): boolean {
    const initialStabMultiplier = stabMultiplier.value;

    if (pokemon.isTerastallized()) {
      if (pokemon.getTypes().includes(pokemon.getTeraType())) {
        // If the tera type is one of the pokemon's original types then the STAB multiplier is increased by 0.25 (to 2.25)
        stabMultiplier.value += 0.25;
      } else if (pokemon.getTeraType() === move.type) {
        // if the tera type is NOT one of the pokemon's original types but is the same as the move type then the STAB multiplier is increased by 0.5
        stabMultiplier.value += 0.5;
      }
    } else if (pokemon.getTypes().includes(move.type)) {
      // If the move type is one of the pokemon's original types then the STAB multiplier is increased by 0.5
      stabMultiplier.value += 0.5;
    }

    return initialStabMultiplier !== stabMultiplier.value;
  }
}
