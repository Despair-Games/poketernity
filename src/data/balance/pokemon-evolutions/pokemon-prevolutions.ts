import { pokemonEvolutions } from "#app/data/balance/pokemon-evolutions/init-pokemon-evolutions";
import type { PokemonPrevolutions } from "#app/data/balance/pokemon-evolutions/pokemon-evolutions";
import type { Species } from "#enums/species";
import { SpeciesFormKey } from "#enums/species-form-key";

export const pokemonPrevolutions: PokemonPrevolutions = {};

export function initPokemonPrevolutions(): void {
  const megaFormKeys = [SpeciesFormKey.MEGA, "", SpeciesFormKey.MEGA_X, "", SpeciesFormKey.MEGA_Y].map(
    (sfk) => sfk as string,
  );
  const prevolutionKeys = Object.keys(pokemonEvolutions);
  prevolutionKeys.forEach((pk) => {
    const evolutions = pokemonEvolutions[pk];
    for (const ev of evolutions) {
      if (ev.evoFormKey && megaFormKeys.indexOf(ev.evoFormKey) > -1) {
        continue;
      }
      pokemonPrevolutions[ev.speciesId] = parseInt(pk) as Species;
    }
  });
}
