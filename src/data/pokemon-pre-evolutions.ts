import { pokemonEvolutions } from "#app/data/pokemon-evolutions/init-pokemon-evolutions";
import type { PokemonPreEvolutions as PokemonPreEvolutions } from "#app/data/pokemon-evolutions";
import type { SpeciesId } from "#enums/species-id";
import { SpeciesFormKey } from "#enums/species-form-key";

export const pokemonPreEvolutions: PokemonPreEvolutions = {};

export function initPokemonPreEvolutions(): void {
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
      pokemonPreEvolutions[ev.speciesId] = parseInt(pk) as SpeciesId;
    }
  });
}
