import type { Pokemon } from "#app/field/pokemon";

/**
 * Matcher to check if a Pokemon has taken a specific amount of damage
 * @param received The object to check. Should be a {@linkcode Pokemon}.
 * @param expectedDamageTaken The expected amount of damage the {@linkcode Pokemon} has taken
 * @returns Whether the matcher passed
 */
export function toHaveTakenDamageMatcher(received: unknown, expectedDamageTaken: number) {
  if (typeof received !== "object" || received === null || (received as Pokemon).type !== "Pokemon") {
    return {
      pass: false,
      message: () => `Expected Pokemon object!`,
    };
  }

  const pokemon = received as Pokemon;
  const actualDamageTaken = pokemon.getInverseHp();
  const pass = actualDamageTaken === expectedDamageTaken;

  return {
    pass,
    message: () =>
      pass
        ? `Expected ${pokemon.name} to NOT have taken ${expectedDamageTaken} damage, but it did!`
        : `Expected ${pokemon.name} to have taken ${expectedDamageTaken} damage, but got ${actualDamageTaken}.`,
  };
}
