import { allMoves } from "#app/data/all-moves";
import { resolve } from "path";
import { readFileSync } from "fs";
import { describe, expect, it } from "vitest";
import { initMoves } from "#app/data/all-moves";
import type { MoveCategory } from "#enums/move-category";
import type { Moves } from "#enums/moves";
import type { Move } from "#app/data/move";
import { MoveFlags } from "#enums/move-flags";

describe("All Moves", () => {
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

  const flagsToCheck = {
    1: MoveFlags.MAKES_CONTACT,
    8: MoveFlags.PUNCHING_MOVE,
    9: MoveFlags.SOUND_BASED,
    13: MoveFlags.TRIAGE_MOVE,
    15: MoveFlags.POWDER_MOVE,
    16: MoveFlags.BITING_MOVE,
    17: MoveFlags.PULSE_MOVE,
    18: MoveFlags.BALLBOMB_MOVE,
    21: MoveFlags.DANCE_MOVE,
  };

  /**
   * Custom Implementations as of 01/2025:
   * - One Hit KO moves
   * - Dark Void --> Accuracy
   * - Zippy Zap --> PP + Power
   * - Heal Order --> PP
   */

  const filename = resolve("./test/moves/all_moves.json");
  const file = readFileSync(filename, { encoding: "utf-8" });
  const moveData: MoveData[] = JSON.parse(file);
  initMoves();
  moveData.forEach((move: MoveData) => {
    const pktyMove = allMoves[move.id as Moves] as Move;
    if (pktyMove && !isUnimplemented(pktyMove.name)) {
      it(`${pktyMove.name}`, async () => {
        expect(pktyMove.type).toBe(move.type_id);
        expect(pktyMove.accuracy).toBe(move.accuracy);
        expect(pktyMove.priority).toBe(move.priority);
        expect(pktyMove.power).toBe(move.power);
        expect(pktyMove.pp).toBe(move.pp);
        expect(pktyMove.category).toBe(move.damage_class_id);
        expect(pktyMove.chance).toBe(move.effect_chance);
        if (move.flags.length > 0) {
          move.flags.forEach((f: MoveFlags) => {
            if (flagsToCheck[f]) {
              expect(pktyMove.hasFlag(flagsToCheck[f])).toBe(true);
            }
          });
        }
      });
    }
  });

  function isUnimplemented(name: string): boolean {
    if (name.includes(" (N)")) {
      return true;
    }
    return false;
  }
});
