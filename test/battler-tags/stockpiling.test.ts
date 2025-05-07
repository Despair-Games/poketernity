import * as messages from "#app/messages";
import { StockpilingTag } from "#battler-tags/stockpiling-tag";
import { Stat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import { StatStageChangePhase } from "#phases/stat-stage-change-phase";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
  vi.spyOn(messages, "getPokemonNameWithAffix").mockImplementation(() => "");
});

describe("BattlerTag - StockpilingTag", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

  beforeAll(() => {
    phaserGame = new Phaser.Game({
      type: Phaser.HEADLESS,
    });
    game = new GameManager(phaserGame);
  });

  afterEach(() => {
    game.phaseInterceptor.restoreOg();
  });

  describe("onAdd", () => {
    it("unshifts a StatStageChangePhase with expected stat stage changes on add", async () => {
      const mockPokemon = {
        getBattlerIndex: () => 0,
      } as Pokemon;

      vi.spyOn(game.scene.phaseManager, "queueMessagePhase").mockImplementation(() => {});

      const subject = new StockpilingTag(1);

      vi.spyOn(game.scene.phaseManager, "unshiftPhase").mockImplementation((phase: StatStageChangePhase) => {
        expect(phase).toBeInstanceOf(StatStageChangePhase);
        expect(phase["stages"]).toEqual(1);
        expect(phase["stats"]).toEqual(expect.arrayContaining([Stat.DEF, Stat.SPDEF]));

        phase["onChange"]!([Stat.DEF, Stat.SPDEF], [1, 1], mockPokemon);
      });

      subject.onAdd(mockPokemon);

      expect(game.scene.phaseManager.unshiftPhase).toBeCalledTimes(1);
    });

    it("unshifts a StatStageChangePhase with expected stat changes on add (one stat maxed)", async () => {
      const mockPokemon = {
        summonData: { statStages: [0, 0, 0, 0, 0, 0, 0] },
        getBattlerIndex: () => 0,
      } as unknown as Pokemon;

      vi.spyOn(game.scene.phaseManager, "queueMessagePhase").mockImplementation(() => {});

      mockPokemon.summonData.statStages[Stat.DEF - 1] = 6;
      mockPokemon.summonData.statStages[Stat.SPD - 1] = 5;

      const subject = new StockpilingTag(1);

      vi.spyOn(game.scene.phaseManager, "unshiftPhase").mockImplementation((phase: StatStageChangePhase) => {
        expect(phase).toBeInstanceOf(StatStageChangePhase);
        expect(phase["stages"]).toEqual(1);
        expect(phase["stats"]).toEqual(expect.arrayContaining([Stat.DEF, Stat.SPDEF]));

        phase["onChange"]!([Stat.DEF, Stat.SPDEF], [1, 1], mockPokemon);
      });

      subject.onAdd(mockPokemon);

      expect(game.scene.phaseManager.unshiftPhase).toBeCalledTimes(1);
    });
  });

  describe("onOverlap", () => {
    it("unshifts a StatStageChangePhase with expected stat changes on overlap", async () => {
      const mockPokemon = {
        getBattlerIndex: () => 0,
      } as Pokemon;

      vi.spyOn(game.scene.phaseManager, "queueMessagePhase").mockImplementation(() => {});

      const subject = new StockpilingTag(1);

      vi.spyOn(game.scene.phaseManager, "unshiftPhase").mockImplementation((phase: StatStageChangePhase) => {
        expect(phase).toBeInstanceOf(StatStageChangePhase);
        expect(phase["stages"]).toEqual(1);
        expect(phase["stats"]).toEqual(expect.arrayContaining([Stat.DEF, Stat.SPDEF]));

        phase["onChange"]!([Stat.DEF, Stat.SPDEF], [1, 1], mockPokemon);
      });

      subject.onOverlap(mockPokemon);

      expect(game.scene.phaseManager.unshiftPhase).toBeCalledTimes(1);
    });
  });

  describe("stack limit, stat tracking, and removal", () => {
    it("can be added up to three times, even when one stat does not change", async () => {
      const mockPokemon = {
        summonData: { statStages: [0, 0, 0, 0, 0, 0, 0] },
        getBattlerIndex: () => 0,
      } as Pokemon;

      vi.spyOn(game.scene.phaseManager, "queueMessagePhase").mockImplementation(() => {});

      mockPokemon.summonData.statStages[Stat.DEF - 1] = 5;
      mockPokemon.summonData.statStages[Stat.SPD - 1] = 4;

      const subject = new StockpilingTag(1);

      const phaseSpy = vi.spyOn(game.scene.phaseManager, "unshiftPhase");

      phaseSpy.mockImplementationOnce((phase: StatStageChangePhase) => {
        expect(phase).toBeInstanceOf(StatStageChangePhase);
        expect(phase["stages"]).toEqual(1);
        expect(phase["stats"]).toEqual(expect.arrayContaining([Stat.DEF, Stat.SPDEF]));

        // def doesn't change
        phase["onChange"]!([Stat.SPDEF], [1], mockPokemon);
      });

      subject.onAdd(mockPokemon);
      expect(subject.stockpiledCount).toBe(1);

      phaseSpy.mockImplementationOnce((phase: StatStageChangePhase) => {
        expect(phase).toBeInstanceOf(StatStageChangePhase);
        expect(phase["stages"]).toEqual(1);
        expect(phase["stats"]).toEqual(expect.arrayContaining([Stat.DEF, Stat.SPDEF]));

        // def doesn't change
        phase["onChange"]!([Stat.SPDEF], [1], mockPokemon);
      });

      subject.onOverlap(mockPokemon);
      expect(subject.stockpiledCount).toBe(2);

      phaseSpy.mockImplementationOnce((phase: StatStageChangePhase) => {
        expect(phase).toBeInstanceOf(StatStageChangePhase);
        expect(phase["stages"]).toEqual(1);
        expect(phase["stats"]).toEqual(expect.arrayContaining([Stat.DEF, Stat.SPDEF]));

        // neither stat changes, stack count should still increase
      });

      subject.onOverlap(mockPokemon);
      expect(subject.stockpiledCount).toBe(3);

      // fourth stack should not be applied
      subject.onOverlap(mockPokemon);
      expect(subject.stockpiledCount).toBe(3);
      expect(subject.statChangeCounts).toMatchObject({ [Stat.DEF]: 0, [Stat.SPDEF]: 2 });

      // removing tag should reverse stat changes
      phaseSpy.mockImplementationOnce((phase: StatStageChangePhase) => {
        expect(phase).toBeInstanceOf(StatStageChangePhase);
        expect(phase["stages"]).toEqual(-2);
        expect(phase["stats"]).toEqual(expect.arrayContaining([Stat.SPDEF]));
      });

      subject.onRemove(mockPokemon);
      expect(game.scene.phaseManager.unshiftPhase).toHaveBeenCalledTimes(4);
    });
  });
});
