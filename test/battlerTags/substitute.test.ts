import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PokemonTurnData, TurnMove, PokemonMove } from "#app/field/pokemon";
import type { Pokemon } from "#app/field/pokemon";
import { MoveResult } from "#app/field/pokemon";
import BattleScene from "#app/battle-scene";
import { BattlerTagLapseType, BindTag, SubstituteTag } from "#app/data/battler-tags";
import { Moves } from "#enums/moves";
import { PokemonAnimType } from "#enums/pokemon-anim-type";
import * as messages from "#app/messages";
import { allMoves } from "#app/data/all-moves";
import type { MoveEffectPhase } from "#app/phases/move-effect-phase";

describe("BattlerTag - SubstituteTag", () => {
  let mockPokemon: Pokemon;

  describe("onAdd behavior", () => {
    beforeEach(() => {
      mockPokemon = {
        scene: new BattleScene(),
        hp: 101,
        id: 0,
        getMaxHp: vi.fn().mockReturnValue(101) as Pokemon["getMaxHp"],
        findAndRemoveTags: vi.fn().mockImplementation((tagFilter) => {
          // simulate a Trapped tag set by another Pokemon, then expect the filter to catch it.
          const trapTag = new BindTag(5, 0);
          expect(tagFilter(trapTag)).toBeTruthy();
          return true;
        }) as Pokemon["findAndRemoveTags"],
      } as unknown as Pokemon;

      vi.spyOn(messages, "getPokemonNameWithAffix").mockReturnValue("");
      vi.spyOn(mockPokemon.scene as BattleScene, "getPokemonById").mockImplementation((pokemonId) =>
        mockPokemon.id === pokemonId ? mockPokemon : null,
      );
    });

    it("sets the tag's HP to 1/4 of the source's max HP (rounded down)", async () => {
      const subject = new SubstituteTag(Moves.SUBSTITUTE, mockPokemon.id);

      vi.spyOn(mockPokemon.scene as BattleScene, "triggerPokemonBattleAnim").mockReturnValue(true);
      vi.spyOn(mockPokemon.scene as BattleScene, "queueMessage").mockReturnValue();

      subject.onAdd(mockPokemon);

      expect(subject.hp).toBe(25);
    });

    it("triggers on-add effects that bring the source out of focus", async () => {
      const subject = new SubstituteTag(Moves.SUBSTITUTE, mockPokemon.id);

      vi.spyOn(mockPokemon.scene as BattleScene, "triggerPokemonBattleAnim").mockImplementation(
        (_pokemon, battleAnimType, _fieldAssets?, _delayed?) => {
          expect(battleAnimType).toBe(PokemonAnimType.SUBSTITUTE_ADD);
          return true;
        },
      );

      vi.spyOn(mockPokemon.scene as BattleScene, "queueMessage").mockReturnValue();

      subject.onAdd(mockPokemon);

      expect(subject.sourceInFocus).toBeFalsy();
      expect((mockPokemon.scene as BattleScene).triggerPokemonBattleAnim).toHaveBeenCalledTimes(1);
      expect((mockPokemon.scene as BattleScene).queueMessage).toHaveBeenCalledTimes(1);
    });

    it("removes effects that trap the source", async () => {
      const subject = new SubstituteTag(Moves.SUBSTITUTE, mockPokemon.id);

      vi.spyOn(mockPokemon.scene as BattleScene, "queueMessage").mockReturnValue();

      subject.onAdd(mockPokemon);
      expect(mockPokemon.findAndRemoveTags).toHaveBeenCalledTimes(1);
    });
  });

  describe("onRemove behavior", () => {
    beforeEach(() => {
      mockPokemon = {
        scene: new BattleScene(),
        hp: 101,
        id: 0,
        isFainted: vi.fn().mockReturnValue(false) as Pokemon["isFainted"],
      } as unknown as Pokemon;

      vi.spyOn(messages, "getPokemonNameWithAffix").mockReturnValue("");
    });

    it("triggers on-remove animation and message", async () => {
      const subject = new SubstituteTag(Moves.SUBSTITUTE, mockPokemon.id);
      subject.sourceInFocus = false;

      vi.spyOn(mockPokemon.scene as BattleScene, "triggerPokemonBattleAnim").mockImplementation(
        (_pokemon, battleAnimType, _fieldAssets?, _delayed?) => {
          expect(battleAnimType).toBe(PokemonAnimType.SUBSTITUTE_REMOVE);
          return true;
        },
      );

      vi.spyOn(mockPokemon.scene as BattleScene, "queueMessage").mockReturnValue();

      subject.onRemove(mockPokemon);

      expect((mockPokemon.scene as BattleScene).triggerPokemonBattleAnim).toHaveBeenCalledTimes(1);
      expect((mockPokemon.scene as BattleScene).queueMessage).toHaveBeenCalledTimes(1);
    });
  });

  describe("lapse behavior", () => {
    beforeEach(() => {
      mockPokemon = {
        scene: new BattleScene(),
        hp: 101,
        id: 0,
        turnData: { acted: true } as PokemonTurnData,
        getLastXMoves: vi
          .fn()
          .mockReturnValue([
            { move: Moves.TACKLE, result: MoveResult.SUCCESS } as TurnMove,
          ]) as Pokemon["getLastXMoves"],
      } as unknown as Pokemon;

      vi.spyOn(messages, "getPokemonNameWithAffix").mockReturnValue("");
    });

    it("PRE_MOVE lapse triggers pre-move animation", async () => {
      const subject = new SubstituteTag(Moves.SUBSTITUTE, mockPokemon.id);

      vi.spyOn(mockPokemon.scene as BattleScene, "triggerPokemonBattleAnim").mockImplementation(
        (_pokemon, battleAnimType, _fieldAssets?, _delayed?) => {
          expect(battleAnimType).toBe(PokemonAnimType.SUBSTITUTE_PRE_MOVE);
          return true;
        },
      );

      vi.spyOn(mockPokemon.scene as BattleScene, "queueMessage").mockReturnValue();

      expect(subject.lapse(mockPokemon, BattlerTagLapseType.PRE_MOVE)).toBeTruthy();

      expect(subject.sourceInFocus).toBeTruthy();
      expect((mockPokemon.scene as BattleScene).triggerPokemonBattleAnim).toHaveBeenCalledTimes(1);
      expect((mockPokemon.scene as BattleScene).queueMessage).not.toHaveBeenCalled();
    });

    it("AFTER_MOVE lapse triggers post-move animation", async () => {
      const subject = new SubstituteTag(Moves.SUBSTITUTE, mockPokemon.id);

      vi.spyOn(mockPokemon.scene as BattleScene, "triggerPokemonBattleAnim").mockImplementation(
        (_pokemon, battleAnimType, _fieldAssets?, _delayed?) => {
          expect(battleAnimType).toBe(PokemonAnimType.SUBSTITUTE_POST_MOVE);
          return true;
        },
      );

      vi.spyOn(mockPokemon.scene as BattleScene, "queueMessage").mockReturnValue();

      expect(subject.lapse(mockPokemon, BattlerTagLapseType.AFTER_MOVE)).toBeTruthy();

      expect(subject.sourceInFocus).toBeFalsy();
      expect((mockPokemon.scene as BattleScene).triggerPokemonBattleAnim).toHaveBeenCalledTimes(1);
      expect((mockPokemon.scene as BattleScene).queueMessage).not.toHaveBeenCalled();
    });

    // TODO: Figure out how to mock a MoveEffectPhase correctly for this test
    it.todo("HIT lapse triggers on-hit message", async () => {
      const subject = new SubstituteTag(Moves.SUBSTITUTE, mockPokemon.id);

      vi.spyOn(mockPokemon.scene as BattleScene, "triggerPokemonBattleAnim").mockReturnValue(true);
      vi.spyOn(mockPokemon.scene as BattleScene, "queueMessage").mockReturnValue();

      const pokemonMove = {
        getMove: vi.fn().mockReturnValue(allMoves[Moves.TACKLE]) as PokemonMove["getMove"],
      } as PokemonMove;

      const moveEffectPhase = {
        move: pokemonMove,
        getUserPokemon: vi.fn().mockReturnValue(undefined) as MoveEffectPhase["getUserPokemon"],
      } as MoveEffectPhase;

      vi.spyOn(mockPokemon.scene as BattleScene, "getCurrentPhase").mockReturnValue(moveEffectPhase);
      vi.spyOn(allMoves[Moves.TACKLE], "hitsSubstitute").mockReturnValue(true);

      expect(subject.lapse(mockPokemon, BattlerTagLapseType.HIT)).toBeTruthy();

      expect((mockPokemon.scene as BattleScene).triggerPokemonBattleAnim).not.toHaveBeenCalled();
      expect((mockPokemon.scene as BattleScene).queueMessage).toHaveBeenCalledTimes(1);
    });

    it("CUSTOM lapse flags the tag for removal", async () => {
      const subject = new SubstituteTag(Moves.SUBSTITUTE, mockPokemon.id);

      vi.spyOn(mockPokemon.scene as BattleScene, "triggerPokemonBattleAnim").mockReturnValue(true);
      vi.spyOn(mockPokemon.scene as BattleScene, "queueMessage").mockReturnValue();

      expect(subject.lapse(mockPokemon, BattlerTagLapseType.CUSTOM)).toBeFalsy();
    });

    it("Unsupported lapse type does nothing", async () => {
      const subject = new SubstituteTag(Moves.SUBSTITUTE, mockPokemon.id);

      vi.spyOn(mockPokemon.scene as BattleScene, "triggerPokemonBattleAnim").mockReturnValue(true);
      vi.spyOn(mockPokemon.scene as BattleScene, "queueMessage").mockReturnValue();

      expect(subject.lapse(mockPokemon, BattlerTagLapseType.TURN_END)).toBeTruthy();

      expect((mockPokemon.scene as BattleScene).triggerPokemonBattleAnim).not.toHaveBeenCalled();
      expect((mockPokemon.scene as BattleScene).queueMessage).not.toHaveBeenCalled();
    });
  });
});
