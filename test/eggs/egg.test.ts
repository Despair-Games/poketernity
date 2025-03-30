import { speciesEggTiers } from "#app/data/balance/species-egg-tiers";
import { allSpecies } from "#app/data/data-lists";
import { Egg, getLegendaryGachaSpeciesForTimestamp, getValidLegendaryGachaSpecies } from "#app/data/egg";
import * as Utils from "#app/utils";
import { isNullOrUndefined } from "#app/utils";
import { EggSourceType } from "#enums/egg-source-types";
import { EggTier } from "#enums/egg-type";
import { SpeciesId } from "#enums/species-id";
import { VariantTier } from "#enums/variant-tier";
import { GameManager } from "#test/test-utils/gameManager";
import { EVERYTHING_SAVE_FILE_PATH } from "#test/test-utils/testUtils";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Egg Generation Tests", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;
  const EGG_HATCH_COUNT: number = 1000;

  beforeAll(() => {
    phaserGame = new Phaser.Game({
      type: Phaser.HEADLESS,
    });
    game = new GameManager(phaserGame);
  });

  afterEach(() => {
    game.phaseInterceptor.restoreOg();
    vi.restoreAllMocks();
  });

  beforeEach(async () => {
    await game.importData(EVERYTHING_SAVE_FILE_PATH);
  });

  it("should return Kyogre for the 10th of June", () => {
    const timestamp = new Date(2024, 5, 10, 15, 0, 0, 0).getTime();
    const expectedSpecies = SpeciesId.KYOGRE;

    const result = getLegendaryGachaSpeciesForTimestamp(timestamp);

    expect(result).toBe(expectedSpecies);
  });

  it("should return Kyogre for the 10th of July", () => {
    const timestamp = new Date(2024, 6, 10, 15, 0, 0, 0).getTime();
    const expectedSpecies = SpeciesId.KYOGRE;

    const result = getLegendaryGachaSpeciesForTimestamp(timestamp);

    expect(result).toBe(expectedSpecies);
  });

  it("should hatch a Kyogre around half the time. Set from legendary gacha", async () => {
    const timestamp = new Date(2024, 6, 10, 15, 0, 0, 0).getTime();
    const expectedSpecies = SpeciesId.KYOGRE;
    let gachaSpeciesCount = 0;

    for (let i = 0; i < EGG_HATCH_COUNT; i++) {
      const result = new Egg({
        timestamp,
        sourceType: EggSourceType.GACHA_LEGENDARY,
        tier: EggTier.LEGENDARY,
      }).generatePlayerPokemon().species.speciesId;
      if (result === expectedSpecies) {
        gachaSpeciesCount++;
      }
    }

    expect(gachaSpeciesCount).toBeGreaterThan(0.4 * EGG_HATCH_COUNT);
    expect(gachaSpeciesCount).toBeLessThan(0.6 * EGG_HATCH_COUNT);
  });

  it("should never be allowed to generate Eternatus via the legendary gacha", () => {
    const validLegendaryGachaSpecies = getValidLegendaryGachaSpecies();
    expect(validLegendaryGachaSpecies.every((s) => speciesEggTiers[s] === EggTier.LEGENDARY)).toBe(true);
    expect(validLegendaryGachaSpecies.every((s) => allSpecies[s].isObtainable())).toBe(true);
    expect(validLegendaryGachaSpecies.includes(SpeciesId.ETERNATUS)).toBe(false);
  });

  it("should hatch an Arceus. Set from species", () => {
    const expectedSpeciesId = SpeciesId.ARCEUS;

    const egg = new Egg({ speciesId: expectedSpeciesId, sourceType: EggSourceType.EVENT });

    expect(egg.speciesId).toBe(expectedSpeciesId);
    expect(egg.generatePlayerPokemon().species.speciesId).toBe(expectedSpeciesId);
  });

  it.each([
    { expectedTier: EggTier.COMMON, name: "a common" },
    { expectedTier: EggTier.RARE, name: "a rare" },
    { expectedTier: EggTier.EPIC, name: "an epic" },
    { expectedTier: EggTier.LEGENDARY, name: "a legendary" },
  ])("should return $name tier egg", ({ expectedTier }) => {
    const egg = new Egg({ tier: expectedTier, sourceType: EggSourceType.EVENT });

    expect(egg.tier).toBe(expectedTier);
  });

  it("should return a manaphy egg set via species", () => {
    const egg = new Egg({ speciesId: SpeciesId.MANAPHY, sourceType: EggSourceType.EVENT });

    expect(egg.isManaphyEgg()).toBeTruthy();
  });

  it("should return a manaphy egg set via id", () => {
    const egg = new Egg({ tier: EggTier.COMMON, id: 204, sourceType: EggSourceType.EVENT });

    expect(egg.isManaphyEgg()).toBeTruthy();
  });

  it("should return an egg with 1000 hatch waves", () => {
    const expectedHatchWaves = 1000;

    const egg = new Egg({ hatchWaves: expectedHatchWaves, sourceType: EggSourceType.EVENT });

    expect(egg.hatchWaves).toBe(expectedHatchWaves);
  });

  it("should return a shiny pokemon", () => {
    const egg = new Egg({ isShiny: true, speciesId: SpeciesId.BULBASAUR, sourceType: EggSourceType.EVENT });

    expect(egg.isShiny).toBeTruthy();
    expect(egg.generatePlayerPokemon().isShiny()).toBeTruthy();
  });

  it.each([
    { expectedVariantTier: VariantTier.STANDARD, name: "standard" },
    { expectedVariantTier: VariantTier.RARE, name: "rare" },
    { expectedVariantTier: VariantTier.EPIC, name: "epic" },
  ])("should return a shiny $name variant", ({ expectedVariantTier }) => {
    const pokemon = new Egg({
      isShiny: true,
      variantTier: expectedVariantTier,
      speciesId: SpeciesId.BULBASAUR,
      sourceType: EggSourceType.EVENT,
    }).generatePlayerPokemon();

    expect(pokemon.shiny).toBeTruthy();
    expect(pokemon.variant).toBe(expectedVariantTier);
  });

  it("should return an egg with an egg move index of 0, 1, 2 or 3", () => {
    const eggMoveIndex = new Egg({ sourceType: EggSourceType.EVENT }).eggMoveIndex;

    const result = !isNullOrUndefined(eggMoveIndex) && eggMoveIndex >= 0 && eggMoveIndex <= 3;

    expect(result).toBeTruthy();
  });

  it("should return an egg with a rare egg move", () => {
    const expectedEggMoveIndex = 3;

    const result = new Egg({ eggMoveIndex: expectedEggMoveIndex, sourceType: EggSourceType.EVENT }).eggMoveIndex;

    expect(result).toBe(expectedEggMoveIndex);
  });

  it("should return a hatched pokemon with a hidden ability", () => {
    const playerPokemon = new Egg({
      overrideHiddenAbility: true,
      speciesId: SpeciesId.BULBASAUR,
      sourceType: EggSourceType.EVENT,
    }).generatePlayerPokemon();

    expect(playerPokemon.abilityIndex).toBe(2);
  });

  it("should add the egg to the game data", () => {
    new Egg({ sourceType: EggSourceType.GACHA_LEGENDARY, pulled: true });

    expect(game.scene.gameData.eggs.length).toBe(1);
  });

  it("should override the egg tier to what matches the Species", () => {
    const expectedEggTier = EggTier.COMMON;

    const egg = new Egg({ tier: EggTier.LEGENDARY, speciesId: SpeciesId.BULBASAUR, sourceType: EggSourceType.EVENT });

    expect(egg.tier).toBe(expectedEggTier);
  });

  it("should override the egg hatch waves to what matches the Species", () => {
    const expectedHatchWaves = 10;

    const egg = new Egg({ tier: EggTier.LEGENDARY, speciesId: SpeciesId.BULBASAUR, sourceType: EggSourceType.EVENT });

    expect(egg.hatchWaves).toBe(expectedHatchWaves);
  });

  it("should increase egg pity", () => {
    const gameData = game.scene.gameData;
    const startPityValues = [...gameData.eggPity];

    new Egg({ sourceType: EggSourceType.GACHA_MOVE, pulled: true, tier: EggTier.COMMON });

    expect(gameData.eggPity[EggTier.RARE]).toBe(startPityValues[EggTier.RARE] + 1);
    expect(gameData.eggPity[EggTier.EPIC]).toBe(startPityValues[EggTier.EPIC] + 1);
    expect(gameData.eggPity[EggTier.LEGENDARY]).toBe(startPityValues[EggTier.LEGENDARY] + 1);
  });

  it("should increase legendary egg pity by two when pulling from the legendary Gacha", () => {
    const gameData = game.scene.gameData;
    const startPityValues = [...gameData.eggPity];

    new Egg({ sourceType: EggSourceType.GACHA_LEGENDARY, pulled: true, tier: EggTier.COMMON });

    expect(gameData.eggPity[EggTier.RARE]).toBe(startPityValues[EggTier.RARE] + 1);
    expect(gameData.eggPity[EggTier.EPIC]).toBe(startPityValues[EggTier.EPIC] + 1);
    expect(gameData.eggPity[EggTier.LEGENDARY]).toBe(startPityValues[EggTier.LEGENDARY] + 2);
  });

  it("should not increase manaphy egg count if bulbasaurs are pulled", () => {
    const gameStats = game.scene.gameData.gameStats;
    const startingManaphyEggCount = gameStats.manaphyEggsPulled;

    for (let i = 0; i < 200; i++) {
      new Egg({ sourceType: EggSourceType.GACHA_MOVE, pulled: true, speciesId: SpeciesId.BULBASAUR });
    }

    expect(gameStats.manaphyEggsPulled).toBe(startingManaphyEggCount);
  });

  it("should increase manaphy egg count when getting a Manaphy egg", () => {
    const gameStats = game.scene.gameData.gameStats;
    const startingManaphyEggCount = gameStats.manaphyEggsPulled;

    const egg = new Egg({ sourceType: EggSourceType.GACHA_MOVE, pulled: true, id: 204, tier: EggTier.COMMON });

    expect(egg.isManaphyEgg).toBeTruthy();
    expect(gameStats.manaphyEggsPulled).toBe(startingManaphyEggCount + 1);
  });

  it("should increase rare eggs pulled statistic when getting a rare egg", () => {
    const gameStats = game.scene.gameData.gameStats;
    const startingRareEggsPulled = gameStats.rareEggsPulled;

    new Egg({ sourceType: EggSourceType.GACHA_MOVE, pulled: true, tier: EggTier.RARE });

    expect(gameStats.rareEggsPulled).toBe(startingRareEggsPulled + 1);
  });

  it("should increase epic eggs pulled statistic when getting an epic egg", () => {
    const gameStats = game.scene.gameData.gameStats;
    const startingEpicEggsPulled = gameStats.epicEggsPulled;

    new Egg({ sourceType: EggSourceType.GACHA_MOVE, pulled: true, tier: EggTier.EPIC });

    expect(gameStats.epicEggsPulled).toBe(startingEpicEggsPulled + 1);
  });

  it("should increase legendary eggs pulled statistic when getting a legendary egg", () => {
    const gameStats = game.scene.gameData.gameStats;
    const startingLegendaryEggsPulled = gameStats.legendaryEggsPulled;

    new Egg({ sourceType: EggSourceType.GACHA_MOVE, pulled: true, tier: EggTier.LEGENDARY });

    expect(gameStats.legendaryEggsPulled).toBe(startingLegendaryEggsPulled + 1);
  });

  it("should increase legendary egg rate when pulling from the legendary gacha", () => {
    vi.spyOn(Utils, "randInt").mockReturnValue(1);

    const expectedTier1 = EggTier.LEGENDARY;
    const expectedTier2 = EggTier.EPIC;

    const result1 = new Egg({ sourceType: EggSourceType.GACHA_LEGENDARY, pulled: true }).tier;
    const result2 = new Egg({ sourceType: EggSourceType.GACHA_MOVE, pulled: true }).tier;

    expect(result1).toBe(expectedTier1);
    expect(result2).toBe(expectedTier2);
  });

  it("should generate an epic shiny from pokemon with a different form", () => {
    const egg = new Egg({
      isShiny: true,
      variantTier: VariantTier.EPIC,
      speciesId: SpeciesId.MIRAIDON,
      sourceType: EggSourceType.EVENT,
    });

    expect(egg.variantTier).toBe(VariantTier.EPIC);
  });

  it("should generate egg moves, species, shinyness, and ability unpredictably for the egg gacha", () => {
    const scene = game.scene;
    scene.setSeed("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    scene.resetSeed();

    const firstEgg = new Egg({ sourceType: EggSourceType.GACHA_SHINY, tier: EggTier.COMMON });
    const firstHatch = firstEgg.generatePlayerPokemon();
    let diffEggMove = false;
    let diffSpecies = false;
    let diffShiny = false;
    let diffAbility = false;
    for (let i = 0; i < EGG_HATCH_COUNT; i++) {
      scene.gameData.unlockPity[EggTier.COMMON] = 0;
      scene.setSeed("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
      scene.resetSeed(); // Make sure that eggs are unpredictable even if using same seed

      const newEgg = new Egg({ sourceType: EggSourceType.GACHA_SHINY, tier: EggTier.COMMON });
      const newHatch = newEgg.generatePlayerPokemon();
      diffEggMove = diffEggMove || newEgg.eggMoveIndex !== firstEgg.eggMoveIndex;
      diffSpecies = diffSpecies || newHatch.species.speciesId !== firstHatch.species.speciesId;
      diffShiny = diffShiny || newHatch.shiny !== firstHatch.shiny;
      diffAbility = diffAbility || newHatch.abilityIndex !== firstHatch.abilityIndex;
    }

    expect(diffEggMove).toBe(true);
    expect(diffSpecies).toBe(true);
    expect(diffShiny).toBe(true);
    expect(diffAbility).toBe(true);
  });

  it("should generate egg moves, shinyness, and ability unpredictably for species eggs", () => {
    const scene = game.scene;
    scene.setSeed("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    scene.resetSeed();

    const firstEgg = new Egg({ speciesId: SpeciesId.BULBASAUR, sourceType: EggSourceType.EVENT });
    const firstHatch = firstEgg.generatePlayerPokemon();
    let diffEggMove = false;
    let diffSpecies = false;
    let diffShiny = false;
    let diffAbility = false;
    for (let i = 0; i < EGG_HATCH_COUNT; i++) {
      scene.setSeed("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
      scene.resetSeed(); // Make sure that eggs are unpredictable even if using same seed

      const newEgg = new Egg({ speciesId: SpeciesId.BULBASAUR, sourceType: EggSourceType.EVENT });
      const newHatch = newEgg.generatePlayerPokemon();
      diffEggMove = diffEggMove || newEgg.eggMoveIndex !== firstEgg.eggMoveIndex;
      diffSpecies = diffSpecies || newHatch.species.speciesId !== firstHatch.species.speciesId;
      diffShiny = diffShiny || newHatch.shiny !== firstHatch.shiny;
      diffAbility = diffAbility || newHatch.abilityIndex !== firstHatch.abilityIndex;
    }

    expect(diffEggMove).toBe(true);
    expect(diffSpecies).toBe(false);
    expect(diffShiny).toBe(true);
    expect(diffAbility).toBe(true);
  });
});
