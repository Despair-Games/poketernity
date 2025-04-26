import { receivedStr, isPokemonInstance } from "#test/test-utils/testUtils";

/**
 * Matcher to check if a Pokemon has taken a specific amount of damage
 * @param received - The object to check. Should be a {@linkcode Pokemon}.
 * @param expectedDamageTaken - The expected amount of damage the {@linkcode Pokemon} has taken
 * @returns Whether the matcher passed
 */
export function toHaveTakenDamageMatcher(received: unknown, expectedDamageTaken: number) {
  if (!isPokemonInstance(received)) {
    return {
      pass: false,
      message: () => `Expected Pokemon, but got ${receivedStr(received)}!`,
    };
  }

  const actualDamageTaken = received.getInverseHp();
  const pass = actualDamageTaken === expectedDamageTaken;

  return {
    pass,
    message: () =>
      pass
        ? `Expected ${received.name} to NOT have taken ${expectedDamageTaken} damage, but it did!`
        : `Expected ${received.name} to have taken ${expectedDamageTaken} damage, but got ${actualDamageTaken}.`,
  };
}
