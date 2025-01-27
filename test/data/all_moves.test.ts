import { allMoves } from "#app/data/all-moves";
import { resolve } from "path";
import { readFileSync } from "fs";
import { describe, expect, it } from "vitest";
import type { MoveCategory } from "#enums/move-category";
import type { Moves } from "#enums/moves";
import type { Move } from "#app/data/move";
import { MoveFlags } from "#enums/move-flags";

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
   * Flags for moves added in Legends Arceus and after were manually added to all_moves.json
   */
  const flagsToCheck = {
    1: MoveFlags.MAKES_CONTACT,
    8: MoveFlags.PUNCHING_MOVE,
    9: MoveFlags.SOUND_MOVE,
    13: MoveFlags.TRIAGE_MOVE,
    15: MoveFlags.POWDER_MOVE,
    16: MoveFlags.BITING_MOVE,
    17: MoveFlags.PULSE_MOVE,
    18: MoveFlags.BULLET_MOVE,
    21: MoveFlags.DANCE_MOVE,
    22: MoveFlags.SLICING_MOVE,
  };

  /**
   * Custom Implementations as of 01/2025:
   * - Horn Drill / Guillotine / Sheer Cold / Fissure : BP set to 200
   * - Imprison : Accuracy is set to 100 in PKTY, not -1
   * - Dark Void : Accurary is set to pre-Gen VIII's 80
   * - Zippy Zap : Uses LGPE's implementation. PP: 10 -> 15, BP: 90 -> 50
   * - Court Change : Accuracy is set to 100 in PKTY, not -1
   */

  const filename = resolve("./test/moves/all_moves.json");
  const file = readFileSync(filename, { encoding: "utf-8" });
  const moveData: MoveData[] = JSON.parse(file);

  it.each(moveData)("$identifier, if implemented, should have correct move data", async (move: MoveData) => {
    const pktyMove = allMoves[move.id as Moves] as Move;
    if (pktyMove && !isUnimplemented(pktyMove.name)) {
      expect(pktyMove.type).toBe(move.type_id - 1); // PokeAPI begins its list of types with the number 1
      expect(pktyMove.accuracy).toBe(move.accuracy);
      expect(pktyMove.priority).toBe(move.priority);
      expect(pktyMove.power).toBe(move.power);
      expect(pktyMove.pp).toBe(move.pp);
      expect(pktyMove.category).toBe(move.damage_class_id);
      expect(pktyMove.chance).toBe(move.effect_chance);
      if (Array.isArray(move.flags)) {
        for (const f of Object.keys(flagsToCheck)) {
          const actualHasFlag = pktyMove.hasFlag(flagsToCheck[f]);
          const expectedHasFlag = move.flags.includes(Number(f));
          expect(actualHasFlag).toBe(expectedHasFlag);
        }
      }
    }
  });

  function isUnimplemented(name: string): boolean {
    return name.includes(" (N)");
  }
});
