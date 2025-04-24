import type { Pokemon } from "#app/field/pokemon";
import { isPokemonObject } from "#test/test-utils/matcherUtils";
import type { ExpectationResult } from "@vitest/expect";

/**
 * Matcher to check if a Pokemon is full hp.
 * @param received - The object to check. Should be a {@linkcode Pokemon}.
 * @returns Whether the matcher passed
 */
export function toHaveFullHpMatcher(received: unknown): ExpectationResult {
  const expectPokemonResult = isPokemonObject(received);

  if (!expectPokemonResult.pass) {
    return expectPokemonResult;
  }

  const pokemon = received as Pokemon;
  const pass = pokemon.isFullHp() === true;
  const ofHpStr = `${pokemon.getInverseHp()}/${pokemon.getMaxHp()} HP`;

  return {
    pass,
    message: () =>
      pass
        ? `Expected ${pokemon.name} to NOT have full hp (${ofHpStr}), but it did!`
        : `Expected ${pokemon.name} to have full hp, but found ${ofHpStr}.`,
  };
}
