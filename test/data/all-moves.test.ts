import { allMoves } from "#data/data-lists";
import { ElementalType } from "#enums/elemental-type";
import { MoveCategory } from "#enums/move-category";
import { MoveFlags } from "#enums/move-flags";
import { enumValueToKey } from "#utils/common-utils";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("All Moves", async () => {
  type MoveData = {
    id: number;
    identifier: string;
    generation_id: number;
    type_id: number;
    power: number;
    pp: number;
    accuracy: number;
    priority: number;
    target_id: number;
    damage_class_id: MoveCategory;
    effect_id: number;
    effect_chance: number;
    flags: number[];
  };

  /**
   * Flags for moves added in Legends Arceus and after were manually added to all-moves.json
   */
  const flagsToCheck = {
    1: MoveFlags.MAKES_CONTACT,
    5: MoveFlags.BOUNCEABLE,
    6: MoveFlags.SNATCHABLE,
    8: MoveFlags.PUNCHING_MOVE,
    9: MoveFlags.SOUND_MOVE,
    13: MoveFlags.TRIAGE_MOVE,
    15: MoveFlags.POWDER_MOVE,
    16: MoveFlags.BITING_MOVE,
    17: MoveFlags.PULSE_MOVE,
    18: MoveFlags.BULLET_MOVE,
    21: MoveFlags.DANCE_MOVE,
    22: MoveFlags.SLICING_MOVE,
  } as const;

  /**
   * Custom Implementations as of 03/2025:
   * - Imprison : Accuracy is set to 100 in PKTY, not -1
   * - Dark Void : Accuracy is set to pre-Gen VIII's 80
   * - Zippy Zap : Uses LGPE's implementation. PP: 10 -> 15, BP: 90 -> 50
   * - Sappy Seed : Cannot be reflected by Magic Coat or Magic Bounce
   * - Court Change : Accuracy is set to 100 in PKTY, not -1
   * - The following moves from Gens 8-9 have been made stealable by another Pokemon with Snatch:
   *   - Jungle Healing
   *   - Power Shift
   *   - Victory Dance
   *   - Shelter
   *   - Lunar Blessing
   *   - Life Dew
   *   - Clangorous Soul
   *   - No Retreat
   *   - Stuff Cheeks
   *   - Take Heart
   *   - Fillet Away
   *   - Shed Tail
   *   - Tidy Up
   *   - Revival Blessing
   */

  const filename = resolve("./test/data/all-moves.json");
  const file = readFileSync(filename, { encoding: "utf-8" });
  const moveData: MoveData[] = JSON.parse(file);

  it.each(moveData)("$identifier, if implemented, should have correct move data", async (move: MoveData) => {
    const pktyMove = allMoves.get(move.id);
    if (pktyMove && !isUnimplemented(pktyMove.name)) {
      const moveCompareMessage = `Elemntal type of "${pktyMove.name}" should be ${enumValueToKey(ElementalType, move.type_id as ElementalType)} but is ${enumValueToKey(ElementalType, pktyMove.type)}`;
      expect(pktyMove.type, moveCompareMessage).toBe(move.type_id);

      const accuracyCompareMessage = `Accuracy of "${pktyMove.name}" should be "${move.accuracy}" but is "${pktyMove.accuracy}"`;
      expect(pktyMove.accuracy, accuracyCompareMessage).toBe(move.accuracy);

      const priorityCompareMessage = `Priority of "${pktyMove.name}" should be "${move.priority}" but is "${pktyMove.priority}"`;
      expect(pktyMove.priority, priorityCompareMessage).toBe(move.priority);

      const powerCompareMessage = `Power of "${pktyMove.name}" should be "${move.power}" but is "${pktyMove.power}"`;
      expect(pktyMove.power, powerCompareMessage).toBe(move.power);

      expect(pktyMove.pp, `PP of "${pktyMove.name}" should be "${move.pp}" but is "${pktyMove.pp}"`).toBe(move.pp);

      const categoryCompareMessage = `Move category of "${pktyMove.name}" should be "${enumValueToKey(MoveCategory, move.damage_class_id)}" but is "${enumValueToKey(MoveCategory, pktyMove.category)}"`;
      expect(pktyMove.category, categoryCompareMessage).toBe(move.damage_class_id);

      const chanceCompareMessage = `Chance of "${pktyMove.name}" should be "${move.effect_chance}" but is "${pktyMove.chance}"`;
      expect(pktyMove.chance, chanceCompareMessage).toBe(move.effect_chance);

      if (Array.isArray(move.flags)) {
        for (const f of Object.keys(flagsToCheck)) {
          // @ts-expect-error - `hasFlag()` is private but we need to check for the existence of the flag
          const actualHasFlag = pktyMove.hasFlag(flagsToCheck[f]);
          const expectedHasFlag = move.flags.includes(Number(f));
          const errOutput = `Expected flag "${enumValueToKey(MoveFlags, flagsToCheck[f])}" of "${pktyMove.name}" to be "${expectedHasFlag}" but got "${actualHasFlag}"!`;
          expect(actualHasFlag, errOutput).toBe(expectedHasFlag);
        }
      }
    }
  });

  function isUnimplemented(name: string): boolean {
    return name.includes(" (N)");
  }
});
