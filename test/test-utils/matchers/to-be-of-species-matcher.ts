import { getPokemonNameWithAffix } from "#app/messages";
import type { SpeciesId } from "#enums/species-id";
import { isPokemonInstance, receivedStr } from "#test/test-utils/test-utils";
import type { CoercibleArray } from "#types/utility-types";
import { coerceArray } from "#utils/common-utils";
import { getPokemonSpecies } from "#utils/pokemon-utils";
import type { MatcherState, SyncExpectationResult } from "@vitest/expect";

/**
 * Matcher to check if a {@linkcode Pokemon} is of or related to a species of Pokemon.
 * @param received - The object to check. Should be a {@linkcode Pokemon}.
 * @param expectedSpeciesId - The {@linkcode SpeciesId} to check for. This may
 * also be set to an array to check for multiple species.
 * @param strict - (Default `true`) If `true`, this requires the input's species to exactly match
 * any of {@linkcode expectedSpeciesId}. If `false`, the input may be of a species in any of the
 * expected species' evolution trees to pass.
 * @returns Whether the matcher passed
 */
export function toBeOfSpeciesMatcher(
  this: MatcherState,
  received: unknown,
  expectedSpeciesId: CoercibleArray<SpeciesId>,
  strict: boolean = true,
): SyncExpectationResult {
  if (!isPokemonInstance(received)) {
    return {
      pass: this.isNot,
      message: () => `Expected Pokemon, but got ${receivedStr(received)}!`,
    };
  }

  const speciesToCheck: SpeciesId[] = strict ? [received.species.speciesId] : [...received.species.getRelatedSpecies()];
  const expectedSpecies = coerceArray(expectedSpeciesId);

  const pass = speciesToCheck.some((s) => expectedSpecies.includes(s));

  const pkmName = getPokemonNameWithAffix(received);
  const expectedSpeciesNames = expectedSpecies.map((esp) => getPokemonSpecies(esp).name);

  return {
    pass,
    message: () =>
      pass
        ? `Expected ${pkmName} to NOT be ${strict ? "the same species as" : "related to"} any of ${expectedSpeciesNames}, but it is!`
        : `Expected ${pkmName} to be ${strict ? "the same species as" : "related to"} any of ${expectedSpeciesNames}, but got ${received.species.name} instead!`,
  };
}
