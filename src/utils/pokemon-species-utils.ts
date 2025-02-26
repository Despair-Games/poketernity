import { allSpecies } from "#app/data/data-lists";
import { Species } from "#enums/species";
import { type PokemonSpeciesForm } from "#app/data/pokemon-species-form";
import { isNullOrUndefined, randSeedItem } from "#app/utils";
import { SpeciesGroups } from "#enums/pokemon-species-groups";
import { POKERUS_STARTER_COUNT, speciesStarterCosts } from "#app/data/balance/starters";
import type PokemonSpecies from "#app/data/pokemon-species";
import { globalScene } from "#app/global-scene";

/**
 * Gets the {@linkcode PokemonSpecies} object associated with the {@linkcode Species} enum given
 * @param species The species to fetch
 * @returns The associated {@linkcode PokemonSpecies} object
 */
export function getPokemonSpecies(species: Species | Species[] | undefined): PokemonSpecies {
  if (!species) {
    throw new Error("`species` must not be undefined in `getPokemonSpecies()`");
  }
  // If a special pool (named trainers) is used here it CAN happen that they have a array as species (which means choose one of those two). So we catch that with this code block
  if (Array.isArray(species)) {
    // Pick a random species from the list
    species = species[Math.floor(Math.random() * species.length)];
  }
  if (species >= 2000) {
    return allSpecies.find((s) => s.speciesId === species)!; // TODO: is this bang correct?
  }
  return allSpecies[species - 1];
}

export function getPokemonSpeciesForm(species: Species, formIndex: number): PokemonSpeciesForm {
  const retSpecies: PokemonSpecies =
    species >= 2000
      ? allSpecies.find((s) => s.speciesId === species)! // TODO: is the bang correct?
      : allSpecies[species - 1];
  if (formIndex < retSpecies.forms?.length) {
    return retSpecies.forms[formIndex];
  }
  return retSpecies;
}

/**
 * Returns a list of Pokemon in a specific group (ex. Mythical, UB, etc.)
 * @param group the group used to make the list
 * @param includeLegends if `true`, AND if `group` is `PARADOX` or `ULTRA_BEAST`, then also include legendaries in the returned list
 * @returns a list of species IDs belonging to the group
 */
export function getSpecialSpeciesList(group: SpeciesGroups, includeLegends?: boolean): Species[] {
  const speciesList = allSpecies
    .map((s) => {
      if (s.group === group) {
        return s.speciesId;
      }
    })
    .filter((s) => !isNullOrUndefined(s));
  if (includeLegends && group === SpeciesGroups.ULTRA_BEAST) {
    speciesList.push(Species.COSMOG, Species.COSMOEM, Species.LUNALA, Species.SOLGALEO, Species.NECROZMA);
  } else if (includeLegends && group === SpeciesGroups.PARADOX) {
    speciesList.push(Species.KORAIDON, Species.MIRAIDON);
  }
  return speciesList as Species[];
}

/**
 * Method to get the daily list of starters with Pokerus.
 * @returns A list of starters with Pokerus
 */
export function getPokerusStarters(): PokemonSpecies[] {
  const pokerusStarters: PokemonSpecies[] = [];
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  globalScene.executeWithSeedOffset(
    () => {
      while (pokerusStarters.length < POKERUS_STARTER_COUNT) {
        const randomSpeciesId = parseInt(randSeedItem(Object.keys(speciesStarterCosts)), 10);
        const species = getPokemonSpecies(randomSpeciesId);
        if (!pokerusStarters.includes(species)) {
          pokerusStarters.push(species);
        }
      }
    },
    0,
    date.getTime().toString(),
  );
  return pokerusStarters;
}
