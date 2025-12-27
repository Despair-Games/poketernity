import { getPokemonNameWithAffix } from "#app/messages";
import { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import type { OneOther } from "#test/@types/test-helpers";
import { getEnumStr, getOnelineDiffStr, getOrdinal } from "#test/test-utils/string-utils";
import { isPokemonInstance, receivedStr } from "#test/test-utils/test-utils";
import type { TurnMove } from "#types/move-types";
import type { MatcherState, SyncExpectationResult } from "@vitest/expect";

//#region Types

export interface ToHaveUsedMoveOptions {
  /**
   * The index of the move history entry to check.
   * The move history is in order from most recent to least recent.
   * @defaultValue `0`
   */
  index?: number;
  /**
   * The number of move entries to retrieve.
   * If negative, retrieve the Pokemon's entire move history.
   * @see {@linkcode Pokemon.getLastXMoves}
   * @defaultValue `1`
   */
  moveCount?: number;
}

export interface MatcherTurnMove extends Partial<TurnMove> {
  moveId?: MoveId;
}

//#endregion
//#region Exports

/**
 * Check whether a Pokemon has used a move matching the given criteria.
 * @see {@linkcode Pokemon.getLastXMoves}
 * @param received - The actual value received. Should be a {@linkcode Pokemon}
 * @param expected - The {@linkcode MoveId} the Pokemon is expected to have used,
 * or a partially filled {@linkcode TurnMove} containing the desired properties to check.
 *
 * **Note**: one of either `moveId` or `move` is required when passing in a `TurnMove` object \
 * (normally there is no `moveId` property on a `TurnMove` object, \
 * but this specially allows passing a `moveId` property in which checks `turnMove.move.id`)
 * @see {@linkcode MatcherTurnMove}
 * @param __namedParameters - (Optional) See {@linkcode ToHaveUsedMoveOptions}
 * @returns Whether the matcher passed
 * @example
 * ```
 * expect(enemy).toHaveUsedMove(MoveId.ABSORB);
 * expect(enemy).toHaveUsedMove({ moveId: MoveId.TACKLE, targets: [BattlerIndex.PLAYER] });
 * expect(enemy).toHaveUsedMove({ move: allMoves.get(MoveId.DRAGON_DANCE), ignorePP: true });
 * ```
 */
export function toHaveUsedMove(
  this: Readonly<MatcherState>,
  received: unknown,
  expected: MoveId | OneOther<MatcherTurnMove, "move" | "moveId">,
  { index = 0, moveCount = 1 }: ToHaveUsedMoveOptions = {},
): SyncExpectationResult {
  if (!isPokemonInstance(received)) {
    return {
      pass: this.isNot,
      message: () => `Expected to receive a Pokémon, but got ${receivedStr(received)}!`,
    };
  }

  const actual = received.getLastXMoves(moveCount).at(index);
  const pkmName = getPokemonNameWithAffix(received);

  if (actual === undefined) {
    return {
      pass: false,
      message: () => `Expected ${pkmName} to have used ${index + 1} moves, but it didn't!`,
      actual: received.getLastXMoves(moveCount),
    };
  }

  const moveIndexStr = index === 0 ? "last move" : `${getOrdinal(index)} most recent move`;

  // `expectedId` is guaranteed to be defined by one of the `if` branches but TS doesn't know this
  let expectedId!: MoveId;
  if (typeof expected === "number") {
    expectedId = expected;
  } else if (expected.move != null) {
    expectedId = expected.move.id;
  } else if (expected.moveId != null) {
    expectedId = expected.moveId;
    // ensures the matcher is able to properly check object equality
    // it expects there to be a `moveId` field on the `received` object if one is passed in as part of `expected`
    // but `TurnMove` doesn't normally have a `moveId` field
    actual["moveId"] = actual.move.id;
  }
  const actualId = actual.move.id;
  const sameId = actualId === expectedId;

  // Break out early if a move-only comparison was done or if the move ID did not match
  if (typeof expected === "number" || !sameId) {
    const expectedIdStr = getEnumStr(MoveId, expectedId);
    const actualIdStr = getEnumStr(MoveId, actualId);
    return {
      pass: sameId,
      message: () =>
        sameId
          ? `Expected ${pkmName}'s ${moveIndexStr} to NOT be ${expectedIdStr}, but it was!`
          : `Expected ${pkmName}'s ${moveIndexStr} to be ${expectedIdStr}, but got ${actualIdStr} instead!`,
      expected,
      actual,
    };
  }

  const pass = this.equals(actual, expected, [
    ...this.customTesters,
    this.utils.subsetEquality,
    this.utils.iterableEquality,
  ]);

  const expectedStr = getOnelineDiffStr.call(this, expected);

  return {
    pass,
    message: () =>
      pass
        ? `Expected ${pkmName}'s ${moveIndexStr} to NOT match ${expectedStr}, but it did!`
        : `Expected ${pkmName}'s ${moveIndexStr} to match ${expectedStr}, but it didn't!`,
    expected,
    actual,
  };
}

//#endregion
