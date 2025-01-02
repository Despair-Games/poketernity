import { Biome } from "#enums/biome";
import { Moves } from "#enums/moves";
import { MapModifier } from "#app/modifier/modifier";
import { api } from "#app/plugins/api/api";
import ModifierSelectUiHandler from "#app/ui/modifier-select-ui-handler";
import { Species } from "#enums/species";
import { Mode } from "#app/ui/ui";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { GameManager } from "#test/testUtils/gameManager";

//const TIMEOUT = 20 * 1000;

describe("Daily Mode", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

  beforeAll(() => {
    phaserGame = new Phaser.Game({
      type: Phaser.HEADLESS,
    });
  });

  beforeEach(() => {
    game = new GameManager(phaserGame);
    vi.spyOn(api.daily, "getSeed").mockResolvedValue("test-seed");
  });

  afterEach(() => {
    game.phaseInterceptor.restoreOg();
  });

  it("should initialize properly", async () => {
    await game.dailyModeHelper.runToSummon();

    const party = game.scene.getPlayerParty();
    expect(party).toHaveLength(3);
    party.forEach((pkm) => {
      expect(pkm.level).toBe(20);
      expect(pkm.moveset.length).toBeGreaterThan(0);
    });
    expect(game.scene.getModifiers(MapModifier).length).toBeGreaterThan(0);
  });
});

describe("Shop modifications", async () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

  beforeAll(() => {
    phaserGame = new Phaser.Game({
      type: Phaser.HEADLESS,
    });
  });
  beforeEach(() => {
    game = new GameManager(phaserGame);

    game.overridesHelper
      .startingWave(9)
      .startingBiome(Biome.ICE_CAVE)
      .battleType("single")
      .startingLevel(100) // Avoid levelling up
      .disableTrainerWaves()
      .moveset([Moves.SPLASH])
      .enemyMoveset(Moves.SPLASH);
    game.modifierHelper.addCheck("EVIOLITE").addCheck("MINI_BLACK_HOLE");
    vi.spyOn(api.daily, "getSeed").mockResolvedValue("test-seed");
  });

  afterEach(() => {
    game.phaseInterceptor.restoreOg();
    game.modifierHelper.clearChecks();
  });

  it("should not have Eviolite and Mini Black Hole available in Classic if not unlocked", async () => {
    await game.classicModeHelper.startBattle([Species.BULBASAUR]);
    game.moveHelper.select(Moves.SPLASH);
    await game.doKillOpponents();
    await game.phaseInterceptor.to("BattleEndPhase");
    game.onNextPrompt("SelectModifierPhase", Mode.MODIFIER_SELECT, () => {
      expect(game.scene.ui.getHandler()).toBeInstanceOf(ModifierSelectUiHandler);
      game.modifierHelper.testCheck("EVIOLITE", false).testCheck("MINI_BLACK_HOLE", false);
    });
  });

  it("should have Eviolite and Mini Black Hole available in Daily", async () => {
    await game.dailyModeHelper.startBattle();
    game.moveHelper.select(Moves.SPLASH);
    await game.doKillOpponents();
    await game.phaseInterceptor.to("BattleEndPhase");
    game.onNextPrompt("SelectModifierPhase", Mode.MODIFIER_SELECT, () => {
      expect(game.scene.ui.getHandler()).toBeInstanceOf(ModifierSelectUiHandler);
      game.modifierHelper.testCheck("EVIOLITE", true).testCheck("MINI_BLACK_HOLE", true);
    });
  });
});
