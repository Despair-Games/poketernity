import { globalScene } from "#app/global-scene";
import { allMoves, allSpecies } from "#data/data-lists";
import type { PokemonSpecies } from "#data/pokemon-species";
import type { PokemonSpeciesForm } from "#data/pokemon-species-form";
import { POKERUS_STARTER_COUNT, speciesStarterCosts } from "#data/starters";
import type { Variant } from "#data/variant";
import type { ElementalType } from "#enums/elemental-type";
import type { MoveId } from "#enums/move-id";
import { SpeciesGroups } from "#enums/species-groups";
import { SpeciesId } from "#enums/species-id";
import type { Pokemon } from "#field/pokemon";
import type { PokemonSummonData, SerializedPokemonSummonData } from "#types/pokemon-types";
import type { CoerceNullPropertiesToUndefined } from "#types/utility-types";
import { randSeedIntRange, randSeedItem } from "#utils/random-utils";
import i18next from "i18next";

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
  const speciesList = allSpecies.filter((s) => s.group === group).map((s) => s.speciesId);

  if (includeLegends && group === SpeciesGroups.ULTRA_BEAST) {
    speciesList.push(SpeciesId.COSMOG, SpeciesId.COSMOEM, SpeciesId.LUNALA, SpeciesId.SOLGALEO, SpeciesId.NECROZMA);
  } else if (includeLegends && group === SpeciesGroups.PARADOX) {
    speciesList.push(SpeciesId.KORAIDON, SpeciesId.MIRAIDON);
  }

  return speciesList;
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
        const randomSpeciesId = Number.parseInt(randSeedItem(Object.keys(speciesStarterCosts)), 10);
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

/** @returns A random {@linkcode ElementalType} (excluding `Unknown` and `Stellar`) */
export function getRandomElementalType(): ElementalType {
  return randSeedIntRange(1, 18) as ElementalType;
}

/**
 * @param pokemon - The {@linkcode Pokemon} with the move of interest
 * @param moveId - The {@linkcode MoveId} to search for within the given Pokemon's moveset
 * @param bypassSummonData - If `true`, ignores the Pokemon's temporary moveset overrides
 * @returns The name of the given move as used by the given Pokemon, or the move's base name
 * if a matching move isn't found within the Pokemon's moveset.
 */
export function getPokemonMoveName(pokemon: Pokemon, moveId: MoveId, bypassSummonData: boolean = false): string {
  return pokemon.getPokemonMove(moveId, bypassSummonData)?.name ?? allMoves.get(moveId).name;
}

export function summonDataToJSON(this: PokemonSummonData): SerializedPokemonSummonData {
  // Pokemon species forms are never saved, only the species ID.
  const speciesForm = this.speciesForm;
  const t: SerializedPokemonSummonData = {
    // the "as omit" is required to avoid TS resolving the overwritten properties to `never`
    // We coerce `null` to `undefined` in the type, as the for loop below replaces `null` with `undefined`
    ...(this as Omit<CoerceNullPropertiesToUndefined<PokemonSummonData>, "speciesForm">),
    speciesForm:
      speciesForm == null ? undefined : { speciesId: speciesForm.speciesId, formIndex: speciesForm.formIndex },
    abilitiesApplied: [...this.abilitiesApplied.values()],
  };
  // Replace `null` with `undefined`, as `undefined` never gets serialized
  for (const [key, value] of Object.entries(t)) {
    if (value === null) {
      t[key] = undefined;
    }
  }
  return t;
}

/**
 * Get the localized shiny descriptor for the provided variant
 * @param variant - The variant to get the shiny descriptor for
 * @returns The localized shiny descriptor
 */
export function getShinyDescriptor(variant: Variant): string {
  switch (variant) {
    case 2:
      return i18next.t("common:epicShiny");
    case 1:
      return i18next.t("common:rareShiny");
    case 0:
      return i18next.t("common:commonShiny");
  }
}
