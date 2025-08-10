import { AbilityId } from "#enums/ability-id";
import { AchvCategory } from "#enums/achv-category";
import { BiomeId } from "#enums/biome-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { Unlockables } from "#enums/unlockables";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Game Over Phase", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

  beforeAll(() => {
    phaserGame = new Phaser.Game({
      type: Phaser.HEADLESS,
    });
  });

  afterEach(() => {
    game.phaseInterceptor.restoreOg();
  });

  beforeEach(() => {
    game = new GameManager(phaserGame);
    game.override
      .moveset([MoveId.MEMENTO, MoveId.ICE_BEAM, MoveId.SPLASH])
      .ability(AbilityId.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .startingWave(200)
      .startingBiome(BiomeId.END)
      .startingLevel(10000);
  });

  it("winning a run should give rewards", async () => {
    await game.classicMode.startBattle(SpeciesId.BULBASAUR);
    vi.spyOn(game.scene, "validateAchievements");

    // Note: `game.doKillOpponents()` does not properly handle final boss
    // Final boss phase 1
    game.move.select(MoveId.ICE_BEAM);
    await game.toNextTurn();

    // Final boss phase 2
    game.move.select(MoveId.ICE_BEAM);
    await game.phaseInterceptor.to("PostGameOverPhase", false);

    // The game refused to actually give the vouchers during tests,
    // so the best we can do is to check that their reward phases occurred.
    expect(game.phaseInterceptor.log.includes("GameOverPhase")).toBe(true);
    expect(game.phaseInterceptor.log.includes("UnlockPhase")).toBe(true);
    expect(game.phaseInterceptor.log.includes("RibbonModifierRewardPhase")).toBe(true);
    expect(game.scene.gameData.unlocks[Unlockables.CHALLENGE_MODE]).toBe(true);
    expect(game.scene.validateAchievements).toHaveBeenCalledWith(AchvCategory.CLASSIC_VICTORY);
    // `BattleScene#validateAchievements` is currently mocked out due to the test framework not supporting multiple scenes
    // therefore it's not possible to test for the achievement being granted
    // expect(game.scene.gameData.achvUnlocks[achvs.CLASSIC_VICTORY.id]).toBeTruthy();
  });

  it("losing a run should not give rewards", async () => {
    await game.classicMode.startBattle(SpeciesId.BULBASAUR);
    vi.spyOn(game.scene, "validateAchievements");

    game.move.select(MoveId.MEMENTO);
    await game.phaseInterceptor.to("PostGameOverPhase", false);

    expect(game.phaseInterceptor.log.includes("GameOverPhase")).toBe(true);
    expect(game.phaseInterceptor.log.includes("UnlockPhase")).toBe(false);
    expect(game.phaseInterceptor.log.includes("RibbonModifierRewardPhase")).toBe(false);
    expect(game.phaseInterceptor.log.includes("GameOverModifierRewardPhase")).toBe(false);
    expect(game.scene.gameData.unlocks[Unlockables.CHALLENGE_MODE]).toBe(false);
    expect(game.scene.validateAchievements).not.toHaveBeenCalledWith(AchvCategory.CLASSIC_VICTORY);
    // expect(game.scene.gameData.achvUnlocks[achvs.CLASSIC_VICTORY.id]).toBeFalsy();
  });
});
