import { G_MAX_FORM_KEYS } from "#app/constants";
import { FORM_CHANGE_MOVE } from "#app/data/pokemon-level-moves";
import { allMoves } from "#app/data/data-lists";
import { GMaxPowerAttr } from "#app/data/moves/move-attrs/gmax-power-attr";
import { pokemonFormLevelMoves } from "#app/data/pokemon-form-level-moves";
import { pokemonFormChanges } from "#app/data/pokemon-forms";
import type { MoveId } from "#enums/move-id";
import { describe, expect, it } from "vitest";

describe("Moveset Data", async () => {
  it("should assign G-max moves to the correct species", async () => {
    // Data in pokemonFormChanges
    for (const species of Object.keys(pokemonFormChanges)) {
      for (const formChange of pokemonFormChanges[species]) {
        if (G_MAX_FORM_KEYS.includes(formChange.formKey)) {
          // If G-max, check that the form change learns the correct G-Max move
          expect(formChange.movesToLearn.length).toBe(1);
          const move = allMoves.get(formChange.movesToLearn[0]);
          expect(move.getAttrs(GMaxPowerAttr)[0].signatureSpecies).toBe(Number(species));
        } else {
          // If not G-max, check that no G-max moves are learned
          for (const moveId of formChange.movesToLearn) {
            expect(allMoves.get(moveId).hasAttr(GMaxPowerAttr)).toBe(false);
          }
        }
      }
    }

    // Data in pokemonFormLevelMoves
    for (const species of Object.keys(pokemonFormLevelMoves)) {
      for (const moveArray of Object.values(pokemonFormLevelMoves[species])) {
        for (const [level, moveId] of moveArray as [number, MoveId][]) {
          // If it is a G-max move, check that the species being assigned this move is correct
          const gmaxAttr = allMoves.get(moveId).getAttrs(GMaxPowerAttr)[0];
          if (gmaxAttr) {
            expect(gmaxAttr.signatureSpecies).toBe(Number(species));
            expect(level).toBe(FORM_CHANGE_MOVE);
          }
        }
      }
    }
  });
});
