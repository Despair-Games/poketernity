import { globalScene } from "#app/global-scene";
import { allSpecies } from "#data/data-lists";
import type PokemonSpecies from "#data/pokemon-species";
import type { PokemonSpeciesForm } from "#data/pokemon-species-form";
import { POKERUS_STARTER_COUNT, speciesStarterCosts } from "#data/starters";
import { SpeciesGroups } from "#enums/pokemon-species-groups";
import { SpeciesId } from "#enums/species-id";
import { isNil } from "#utils/common-utils";
import { randSeedInt, randSeedItem } from "#utils/random-utils";

/**
 * Gets the {@linkcode PokemonSpecies} object associated with the {@linkcode SpeciesId} enum given
 * @param species - The species to fetch
 * @returns The associated {@linkcode PokemonSpecies} object
 */
export function getPokemonSpecies(species: SpeciesId | SpeciesId[]): PokemonSpecies {
  // If a special pool (named trainers) is used here it CAN happen that they have a array as species (which means choose one of those two).
  // TODO: this should be handled elsewhere
  if (Array.isArray(species)) {
    species = species[Math.floor(Math.random() * species.length)];
  }

  if (species >= 2000) {
    return allSpecies.find((s) => s.speciesId === species)!;
  }

  return allSpecies[species - 1];
}

export function getPokemonSpeciesForm(species: SpeciesId, formIndex: number): PokemonSpeciesForm {
  const retSpecies: PokemonSpecies =
    species >= 2000 ? allSpecies.find((s) => s.speciesId === species)! : allSpecies[species - 1];

  if (formIndex < retSpecies.forms?.length) {
    return retSpecies.forms[formIndex];
  }

  return retSpecies;
}

/**
 * Returns a list of Pokemon in a specific group (ex. Mythical, UB, etc.)
 * @param group - The group used to make the list
 * @param includeLegends - (Optional) If `true`, AND if `group` is `PARADOX` or `ULTRA_BEAST`, then also include legendaries in the returned list
 * @returns a list of species IDs belonging to the group
 */
export function getSpecialSpeciesList(group: SpeciesGroups, includeLegends?: boolean): SpeciesId[] {
  const speciesList = allSpecies
    .map((s) => {
      if (s.group === group) {
        return s.speciesId;
      }
    })
    .filter((s) => !isNil(s));

  if (includeLegends && group === SpeciesGroups.ULTRA_BEAST) {
    speciesList.push(SpeciesId.COSMOG, SpeciesId.COSMOEM, SpeciesId.LUNALA, SpeciesId.SOLGALEO, SpeciesId.NECROZMA);
  } else if (includeLegends && group === SpeciesGroups.PARADOX) {
    speciesList.push(SpeciesId.KORAIDON, SpeciesId.MIRAIDON);
  }

  return speciesList as SpeciesId[];
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

/**
 * Generates IVs from a given {@linkcode id} by extracting 5 bits at a time
 * starting from the least significant bit up to the 30th most significant bit.
 * @param id - 32-bit number
 * @returns An array of six numbers corresponding to 5-bit chunks from {@linkcode id}
 * @todo Just generate 6 random numbers instead of doing this nonsense; also make pokemon IDs into actual UUIDs
 */
export function getIvsFromId(id?: number): number[] {
  if (isNil(id)) {
    id = randSeedInt(4294967296);
  }

  return [
    (id & 0x3e000000) >>> 25,
    (id & 0x01f00000) >>> 20,
    (id & 0x000f8000) >>> 15,
    (id & 0x00007c00) >>> 10,
    (id & 0x000003e0) >>> 5,
    id & 0x0000001f,
  ];
}
