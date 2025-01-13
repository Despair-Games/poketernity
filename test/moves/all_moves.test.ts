import { allMoves } from "#app/data/all-moves";
import { resolve } from "path";
import { readFileSync } from "fs";
import { describe, expect, it } from "vitest";
import { initMoves } from "#app/data/all-moves";
import type { MoveCategory } from "#enums/move-category";
import type { Moves } from "#enums/moves";
import type { Move } from "#app/data/move";

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
  };

  const filename = resolve("./test/moves/all_moves.json");
  const file = readFileSync(filename, { encoding: "utf-8" });
  const moveData: MoveData[] = JSON.parse(file);
  initMoves();
  moveData.forEach((move: MoveData) => {
    const pktyMove = allMoves[move.id as Moves] as Move;
    if (pktyMove && !isUnimplemented(pktyMove.name)) {
      it(`${pktyMove.name}`, async () => {
        expect(pktyMove.type).toBe(move.type_id);
        expect(pktyMove.accuracy).toBe(move.accuracy); // Dark Void
        // Needs :
        // Category
        // Power
        // PP
        // Accuracy
        // Base Priority
        // Effect Chance
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
