import { SpeciesId } from "#enums/species-id";
import type { GameData } from "#system/game-data";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

// TODO: merge these tests with those in set-pokemon-caught.test once ivs get updated by `setPokemonCaught`
describe("GameData.updateSpeciesDexIvs", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;
  let gameData: GameData;

  beforeAll(() => {
    phaserGame = new Phaser.Game({
      type: Phaser.HEADLESS,
    });
  });

  beforeEach(async () => {
    game = new GameManager(phaserGame);
    gameData = game.scene.gameData;
  });

  afterEach(() => {
    game.phaseInterceptor.restoreOg();
  });

  it("should update the IVs to the maximum between current and new IVs", async () => {
    const speciesId = SpeciesId.BULBASAUR;
    const starterData = gameData.starterData[speciesId];

    expect(starterData.ivs).toEqual([15, 15, 15, 15, 15, 15]);

    gameData.updateSpeciesDexIvs(speciesId, [0, 1, 2, 30, 4, 16]);

    expect(starterData.ivs).toEqual([15, 15, 15, 30, 15, 16]);
  });

  it("should update IVs for starter Pokemon and their pre-evolutions", async () => {
    const pichuStarterData = gameData.starterData[SpeciesId.PICHU];
    const pikachuStarterData = gameData.starterData[SpeciesId.PIKACHU];

    expect(pichuStarterData.ivs).toEqual([0, 0, 0, 0, 0, 0]);
    expect(pikachuStarterData.ivs).toEqual([0, 0, 0, 0, 0, 0]);

    gameData.updateSpeciesDexIvs(SpeciesId.RAICHU, [13, 1, 2, 30, 4, 16]);

    expect(pichuStarterData.ivs).toEqual([13, 1, 2, 30, 4, 16]);
    expect(pikachuStarterData.ivs).toEqual([13, 1, 2, 30, 4, 16]);
  });

  it("should not update IVs for the evolution of baby starters", async () => {
    const pichuStarterData = gameData.starterData[SpeciesId.PICHU];
    const pikachuStarterData = gameData.starterData[SpeciesId.PIKACHU];

    expect(pichuStarterData.ivs).toEqual([0, 0, 0, 0, 0, 0]);
    expect(pikachuStarterData.ivs).toEqual([0, 0, 0, 0, 0, 0]);

    gameData.updateSpeciesDexIvs(SpeciesId.PICHU, [13, 1, 2, 30, 4, 16]);

    expect(pichuStarterData.ivs).toEqual([13, 1, 2, 30, 4, 16]);
    expect(pikachuStarterData.ivs).toEqual([0, 0, 0, 0, 0, 0]);
  });
});
