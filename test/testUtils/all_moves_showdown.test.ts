import { allMoves } from "#app/data/all-moves";
import { describe, expect, it } from "vitest";
import { MoveCategory } from "#enums/move-category";
import { Moves } from "#enums/moves";
import type { Move } from "#app/data/move";
import { MoveFlags } from "#enums/move-flags";
import { showdownMoveData } from "./showdownMoveData";
import { Type } from "#enums/type";
import { capitalizeFirstLetter, isNullOrUndefined } from "#app/utils";

describe("All Moves", () => {
  type MoveData = {
    num: number;
    name: string;
    type: string;
    basePower: number;
    pp: number;
    accuracy: number | true;
    priority: number;
    category: string;
    self?: { chance?: number };
    secondary?: { chance: number };
    secondaries?: { chance: number }[];
    flags: {
      contact?: number;
      punch?: number;
      sound?: number;
      heal?: number;
      powder?: number;
      bite?: number;
      pulse?: number;
      bullet?: number;
      dance?: number;
      slicing?: number;
    };
    hasSheerForce?: boolean;
  };

  const flagsToCheck = {
    contact: MoveFlags.MAKES_CONTACT,
    punch: MoveFlags.PUNCHING_MOVE,
    sound: MoveFlags.SOUND_BASED,
    heal: MoveFlags.TRIAGE_MOVE,
    powder: MoveFlags.POWDER_MOVE,
    bite: MoveFlags.BITING_MOVE,
    pulse: MoveFlags.PULSE_MOVE,
    bullet: MoveFlags.BALLBOMB_MOVE,
    dance: MoveFlags.DANCE_MOVE,
    slicing: MoveFlags.SLICING_MOVE,
  };

  const showdownMoveValues: MoveData[] = Object.values(showdownMoveData) as MoveData[];

  it.each(showdownMoveValues)("$name, if it exists, should have correct move data", async (showdownMove: MoveData) => {
    const pktyMove = allMoves[showdownMove.num as Moves] as Move;
    if (showdownMove.num > 0 && pktyMove && !isHiddenPowerType(showdownMove)) {
      expect(removePartialTag(pktyMove.name)).toBe(showdownMove.name);
      expect(convertType(pktyMove.type)).toBe(showdownMove.type);
      expect(pktyMove.accuracy).toBe(convertAccuracy(showdownMove.accuracy));
      expect(pktyMove.priority).toBe(showdownMove.priority);
      if (pktyMove.power > -1 && showdownMove.basePower > -1) {
        expect(pktyMove.power).toBe(showdownMove.basePower);
      }
      expect(pktyMove.pp).toBe(showdownMove.pp);
      expect(convertCategory(pktyMove.category)).toBe(showdownMove.category);
      expect(pktyMove.chance).toBe(getEffectChance(showdownMove));
      for (const f of Object.keys(flagsToCheck)) {
        const actualHasFlag = pktyMove.hasFlag(flagsToCheck[f]);
        const expectedHasFlag = !isNullOrUndefined(showdownMove.flags[f]);
        expect(actualHasFlag).toBe(expectedHasFlag);
      }
    }
  });

  /**
   * Removes the (P) tag from a Poketernity move's name.
   */
  function removePartialTag(name: string): string {
    if (name.includes(" (P)")) {
      return name.slice(0, name.indexOf(" (P)"));
    } else {
      return name;
    }
  }

  /**
   * Checks whether or not a Showdown move is a Hidden Power with an alternate type (e.g., Hidden Power Dragon)
   */
  function isHiddenPowerType(showdownMove: MoveData): boolean {
    return showdownMove.name.includes("Hidden Power") && showdownMove.name !== "Hidden Power";
  }

  /**
   * Converts Pkty's move types (stored as an enum) to Showdown's move types (stored as a string)
   */
  function convertType(pktyType: Type): string {
    return capitalizeFirstLetter(Type[pktyType].toLowerCase());
  }

  /**
   * Converts Showdown's move accuracies to a number (Showdown uses `true` to denote a move that bypasses accuracy checks)
   */
  function convertAccuracy(accuracy: number | true) {
    return accuracy === true ? -1 : accuracy;
  }

  /**
   * Converts Pkty's move categories (stored as an enum) to Showdown's move categories (stored as a string)
   */
  function convertCategory(pktyCategory: MoveCategory): string {
    return capitalizeFirstLetter(MoveCategory[pktyCategory].toLowerCase());
  }

  /**
   * Extracts a move's effect chance from a Showdown move's data.
   */
  function getEffectChance(showdownMove: MoveData): number {
    if (showdownMove.num === Moves.FICKLE_BEAM) {
      return 30; // See `.edgeCase()` tag in Pkty's code
    } else if (!isNullOrUndefined(showdownMove.self?.chance)) {
      return showdownMove.self.chance; // Edge case for Showdown's code for Diamond Storm
    } else if (showdownMove.secondary) {
      if (isNullOrUndefined(showdownMove.secondary.chance)) {
        // Edge case for Sheer Force-boosted moves without coded secondary
        return 100;
      }
      return showdownMove.secondary.chance;
    } else if (showdownMove.secondaries) {
      return showdownMove.secondaries[showdownMove.secondaries.length - 1].chance;
    } else if (showdownMove.hasSheerForce) {
      return 100;
    } else {
      return -1;
    }
  }
});
