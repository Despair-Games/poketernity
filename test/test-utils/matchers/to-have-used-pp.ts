import { getPokemonNameWithAffix } from "#app/messages";
import { activeOverrides } from "#app/overrides";
import { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import { getEnumStr } from "#test/test-utils/string-utils";
import { isPokemonInstance, receivedStr } from "#test/test-utils/test-utils";
import { coerceArray } from "#utils/common-utils";
import type { MatcherState, SyncExpectationResult } from "@vitest/expect";

/**
 * Matcher to check the amount of PP consumed by a Pokemon.
 * @param received - The actual value received. Should be a {@linkcode Pokemon}
 * @param moveId - The {@linkcode MoveId} that should have consumed PP
 * @param ppUsed - The numerical amount of PP that should have been consumed,
 *   or `"all"` to check that the move is _out_ of PP.
 * @returns Whether the matcher passed
 * @remarks
 * If the Pokemon's moveset has been set via {@linkcode activeOverrides | a moveset override} \
 * or does not contain exactly one copy of `moveId`, this will fail the test.
 */
export function toHaveUsedPP(
  this: Readonly<MatcherState>,
  received: unknown,
  moveId: MoveId,
  ppUsed: number | "all",
): SyncExpectationResult {
  if (!isPokemonInstance(received)) {
    return {
      pass: this.isNot,
      message: () => `Expected to receive a Pokémon, but got ${receivedStr(received)}!`,
    };
  }

  const override = received.isPlayer() ? activeOverrides.MOVESET_OVERRIDE : activeOverrides.ENEMY_MOVESET_OVERRIDE;
  if (coerceArray(override).length > 0) {
    return {
      pass: this.isNot,
      message: () =>
        `Cannot test for PP consumption with ${received.isPlayer() ? "player" : "enemy"} moveset overrides active!`,
    };
  }

  const pkmName = getPokemonNameWithAffix(received);
  const moveStr = getEnumStr(MoveId, moveId);

  const movesetMoves = received.getMoveset().filter((pm) => pm.moveId === moveId);
  if (movesetMoves.length !== 1) {
    return {
      pass: this.isNot,
      message: () =>
        `Expected MoveId.${moveStr} to appear in ${pkmName}'s moveset exactly once, but got ${movesetMoves.length} times!`,
      expected: moveId,
      actual: received.getMoveset(),
    };
  }

  const move = movesetMoves[0]; // will be the only move in the array
  let expected = ppUsed;
  const actual = move.ppUsed;

  if (expected === 0) {
    const pass = actual === 0;

    return {
      pass,
      message: () =>
        pass
          ? `Expected ${pkmName}'s ${moveStr} to have used PP, but it didn't!`
          : `Expected ${pkmName}'s ${moveStr} to NOT have used PP, but got ${actual} PP used instead!`,
      expected,
      actual,
    };
  }

  let ppStr = `used ${expected} PP`;
  const ppLeftStr = `${actual} PP used`;
  if (expected === "all") {
    ppStr = "used all its PP";
    expected = move.getMovePp();
  }
  const pass = actual === expected;

  return {
    pass,
    message: () =>
      pass
        ? `Expected ${pkmName}'s ${moveStr} to NOT have ${ppStr}, but it did!`
        : `Expected ${pkmName}'s ${moveStr} to have ${ppStr}, but got ${ppLeftStr} instead!`,
    expected,
    actual,
  };
}
