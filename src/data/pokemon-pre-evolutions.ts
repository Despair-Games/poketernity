import type { PokemonPreEvolutions } from "#data/pokemon-evolutions";
import { SpeciesFormKey } from "#enums/species-form-key";
import type { SpeciesId } from "#enums/species-id";
import { pokemonEvolutions } from "#init/init-pokemon-evolutions";

export const pokemonPreEvolutions: PokemonPreEvolutions = {};

export function initPokemonPreEvolutions(): void {
  const megaFormKeys = [SpeciesFormKey.MEGA, "", SpeciesFormKey.MEGA_X, "", SpeciesFormKey.MEGA_Y].map(
    (sfk) => sfk as string,
  );
  for (const [preEvolution, evolutions] of Object.entries(pokemonEvolutions)) {
    for (const ev of evolutions) {
      if (ev.evoFormKey && megaFormKeys.includes(ev.evoFormKey)) {
        continue;
      }
      pokemonPreEvolutions[ev.speciesId] = Number(preEvolution) as SpeciesId;
    }
  }
}
