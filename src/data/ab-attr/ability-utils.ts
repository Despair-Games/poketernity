import type Pokemon from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { Abilities } from "#enums/abilities";
import { Species } from "#enums/species";

/**
 * Sets the ability of a Pokémon as revealed.
 *
 * @param pokemon - The Pokémon whose ability is being revealed.
 */
export function setAbilityRevealed(pokemon: Pokemon): void {
  if (pokemon.battleData) {
    pokemon.battleData.abilityRevealed = true;
  }
}

/**
 * Returns the Pokemon with weather-based forms
 */
export function getPokemonWithWeatherBasedForms() {
  return globalScene
    .getField(true)
    .filter(
      (p) =>
        (p.hasAbility(Abilities.FORECAST) && p.species.speciesId === Species.CASTFORM)
        || (p.hasAbility(Abilities.FLOWER_GIFT) && p.species.speciesId === Species.CHERRIM),
    );
}
