/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { AbilityId } from "#enums/ability-id";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */

import { AbAttr } from "#abilities/ab-attr";
import { ElementalType } from "#enums/elemental-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { ValueHolder } from "#utils/common-utils";

/**
 * Increases the STAB multiplier by `+0.5` if the move type is the same as one of the pokemon's types.
 * If the Pokemon is terastallized, then the STAB multiplier is only applied if the move type is the same as the tera type.
 * The total STAB multiplier is capped at `2.25`.
 *
 * Used for the {@linkcode AbilityId.ADAPTABILITY | Adaptability} ability.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Adaptability_(Ability) | Adaptability (Ability) - Bulbapedia}
 * @see {@link https://github.com/Despair-Games/poketernity/blob/beta/docs/stab.md}
 */
export class StabBoostAbAttr extends AbAttr {
  protected override readonly abAttrKey = "StabBoostAbAttr";

  /**
   * @param pokemon - The {@linkcode Pokemon} with this ability
   * @param _simulated - n/a
   * @param move - The {@linkcode Move} being used
   * @param stabMultiplier - A {@linkcode NumberHolder} containing the move's STAB multiplier for the current attack
   * @returns `true` if the STAB multiplier was increased
   */
  public override apply(pokemon: Pokemon, _simulated: boolean, move: Move, stabMultiplier: ValueHolder<number>): void {
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
  }

  public override canApply(...[pokemon, , move]: Parameters<this["apply"]>): boolean {
    const moveType = pokemon.getMoveType(move);
    return moveType !== ElementalType.STELLAR && pokemon.getTypes(true).includes(moveType);
  }
}
