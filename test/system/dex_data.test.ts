import { defaultStarterSpecies } from "#app/data/balance/default-starters";
import { AbilityAttr, DexAttr } from "#app/data/dex-attributes";
import { PlayerPokemon } from "#app/field/pokemon";
import type { GameData } from "#app/system/game-data";
import { getPokemonSpecies } from "#app/utils/pokemon-species-utils";
import { Gender } from "#enums/gender";
import { Nature } from "#enums/nature";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import { describe, beforeAll, afterEach, beforeEach, it, expect } from "vitest";

describe("Dex Data", () => {
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

  it("should unlock default attributes for starter Pokemon", async () => {
    const neutralNatures = [Nature.HARDY, Nature.DOCILE, Nature.SERIOUS, Nature.BASHFUL, Nature.QUIRKY];
    const defaultIVs = new Array(6).fill(15);

    const caughtCount = gameData.getSpeciesCount((dexEntry) => !!dexEntry.caughtAttr);
    expect(caughtCount).toBe(defaultStarterSpecies.length);

    for (const speciesId of defaultStarterSpecies) {
      const dexData = gameData.dexData[speciesId];
      const starterData = gameData.starterData[speciesId];
      expect(dexData).toBeDefined();
      expect(starterData).toBeDefined();

      expect(starterData.abilityAttr & AbilityAttr.ABILITY_1).toBeTruthy();
      expect(starterData.abilityAttr & AbilityAttr.ABILITY_2).toBeFalsy();
      expect(starterData.abilityAttr & AbilityAttr.ABILITY_HIDDEN).toBeFalsy();

      const unlockedNatures = gameData.getNaturesForAttr(dexData.natureAttr);
      expect(unlockedNatures.length).toBe(1);
      expect(neutralNatures.includes(unlockedNatures[0])).toBeTruthy();

      expect(dexData.seenCount).toBe(0);
      expect(dexData.caughtCount).toBe(0);
      expect(dexData.hatchedCount).toBe(0);

      [dexData.caughtAttr, dexData.seenAttr].forEach((attr: bigint) => {
        expect(attr !== 0n).toBeTruthy();
        expect(attr & DexAttr.NON_SHINY).toBeTruthy();
        expect(attr & DexAttr.DEFAULT_VARIANT).toBeTruthy();
        expect(attr & DexAttr.FEMALE).toBeTruthy();
        expect(attr & DexAttr.MALE).toBeTruthy();
        expect(attr & DexAttr.SHINY).toBeFalsy();
        expect(attr & DexAttr.VARIANT_2).toBeFalsy();
        expect(attr & DexAttr.VARIANT_3).toBeFalsy();
        expect(attr & DexAttr.DEFAULT_FORM).toBeTruthy();
        expect(gameData.getFormIndex(attr)).toBe(0);
      });
      expect(dexData.ivs).toEqual(defaultIVs);
    }
  });

  it("should update data of caught Pokemon", async () => {
    await game.scene.initStarterColors();
    expect(gameData.gameStats.pokemonCaught).toBe(0);

    const species = getPokemonSpecies(Species.BULBASAUR);
    const dexData = gameData.dexData[species.speciesId];
    const starterData = gameData.starterData[species.getRootSpeciesId()];

    expect(starterData.candyCount).toBe(0);
    expect(starterData.abilityAttr & AbilityAttr.ABILITY_1).toBeTruthy();
    expect(starterData.abilityAttr & AbilityAttr.ABILITY_2).toBeFalsy();
    expect(starterData.abilityAttr & AbilityAttr.ABILITY_HIDDEN).toBeFalsy();

    expect(dexData.caughtCount).toBe(0);
    expect(dexData.caughtAttr & DexAttr.SHINY).toBeFalsy();
    expect(gameData.getNaturesForAttr(dexData.natureAttr).length).toBe(1);
    expect(gameData.getNaturesForAttr(dexData.natureAttr).includes(Nature.MODEST)).toBeFalsy();

    // bulbasaur
    const newCatch = new PlayerPokemon(species, 5, 1, 0, Gender.MALE, false, 0, [], Nature.MODEST);
    const newStarters = await gameData.setPokemonCaught(newCatch, true, false, false);

    expect(newStarters.length).toBe(0);
    expect(gameData.gameStats.pokemonCaught).toBe(1);
    expect(starterData.candyCount).toBe(1);
    expect(starterData.abilityAttr & AbilityAttr.ABILITY_2).toBeTruthy();

    expect(dexData.caughtCount).toBe(1);
    expect(gameData.getNaturesForAttr(dexData.natureAttr).length).toBe(2);
    expect(gameData.getNaturesForAttr(dexData.natureAttr).includes(Nature.MODEST)).toBeTruthy();
  });

  it("should update data for a caught Pokemon's pre-evolutions", async () => {
    await game.scene.initStarterColors();
    expect(gameData.gameStats.pokemonCaught).toBe(0);
    expect(gameData.gameStats.shinyPokemonCaught).toBe(0);

    const starterData = gameData.starterData[Species.BULBASAUR];
    expect(starterData.candyCount).toBe(0);
    expect(starterData.abilityAttr & AbilityAttr.ABILITY_1).toBeTruthy();
    expect(starterData.abilityAttr & AbilityAttr.ABILITY_2).toBeFalsy();
    expect(starterData.abilityAttr & AbilityAttr.ABILITY_HIDDEN).toBeFalsy();

    const bulbaDexData = gameData.dexData[Species.BULBASAUR];
    const ivyDexData = gameData.dexData[Species.IVYSAUR];
    const venuDexData = gameData.dexData[Species.VENUSAUR];

    [ivyDexData, venuDexData].forEach((dexData) => {
      expect(dexData.caughtCount).toBe(0);
      expect(dexData.hatchedCount).toBe(0);
      expect(dexData.caughtAttr).toBeFalsy();
      expect(gameData.getNaturesForAttr(dexData.natureAttr).length).toBe(0);
    });

    // Catch shiny tier 2 a Venusaur
    const species = getPokemonSpecies(Species.VENUSAUR);
    const newCatch = new PlayerPokemon(species, 5, 2, 0, Gender.FEMALE, true, 1, [], Nature.ADAMANT);
    const newStarters = await gameData.setPokemonCaught(newCatch, true, false, false);
    expect(newStarters.length).toBe(0);

    expect(gameData.gameStats.pokemonCaught).toBe(1);
    expect(gameData.gameStats.shinyPokemonCaught).toBe(1);
    expect(bulbaDexData.caughtCount).toBe(0);
    expect(ivyDexData.caughtCount).toBe(0);
    expect(venuDexData.caughtCount).toBe(1);

    expect(starterData.candyCount).toBe(10); // catching a rare tier shiny gives 10 candy
    expect(starterData.abilityAttr & AbilityAttr.ABILITY_HIDDEN).toBeTruthy();
    expect(bulbaDexData.caughtAttr & DexAttr.NON_SHINY).toBeTruthy();
    expect(bulbaDexData.caughtAttr & DexAttr.SHINY).toBeTruthy();
    expect(bulbaDexData.caughtAttr & DexAttr.DEFAULT_VARIANT).toBeTruthy();
    expect(bulbaDexData.caughtAttr & DexAttr.VARIANT_2).toBeTruthy();
    expect(bulbaDexData.caughtAttr & DexAttr.VARIANT_3).toBeFalsy();
    expect(gameData.getNaturesForAttr(bulbaDexData.natureAttr).length).toBe(2);
    expect(gameData.getNaturesForAttr(bulbaDexData.natureAttr).includes(Nature.ADAMANT)).toBeTruthy();

    [ivyDexData, venuDexData].forEach((dexData) => {
      expect(dexData.caughtAttr & DexAttr.NON_SHINY).toBeFalsy();
      expect(dexData.caughtAttr & DexAttr.SHINY).toBeTruthy();
      expect(dexData.caughtAttr & DexAttr.DEFAULT_VARIANT).toBeFalsy();
      expect(dexData.caughtAttr & DexAttr.VARIANT_2).toBeTruthy();
      expect(dexData.caughtAttr & DexAttr.VARIANT_3).toBeFalsy();
      expect(dexData.caughtAttr & DexAttr.FEMALE).toBeTruthy();
      expect(dexData.caughtAttr & DexAttr.MALE).toBeFalsy();
      expect(gameData.getNaturesForAttr(dexData.natureAttr).length).toBe(1);
      expect(gameData.getNaturesForAttr(dexData.natureAttr)[0]).toBe(Nature.ADAMANT);
    });
  });

  it("should create data for new catches and their pre evolutions", async () => {
    await game.scene.initStarterColors();
    expect(gameData.gameStats.pokemonCaught).toBe(0);

    const starterData = gameData.starterData[Species.PHANPY];
    for (const ability of Object.values(AbilityAttr)) {
      expect(starterData.abilityAttr & ability).toBeFalsy();
    }
    expect(starterData.candyCount).toBe(0);

    const phanpyDexData = gameData.dexData[Species.PHANPY];
    const donphanDexData = gameData.dexData[Species.DONPHAN];

    [phanpyDexData, donphanDexData].forEach((dexData) => {
      expect(dexData.caughtCount).toBe(0);
      expect(dexData.hatchedCount).toBe(0);
      expect(dexData.caughtAttr).toBeFalsy();
      expect(gameData.getNaturesForAttr(dexData.natureAttr).length).toBe(0);
    });

    // Catch a donphan, should unlock phanpy as a starter
    let species = getPokemonSpecies(Species.DONPHAN);
    let newCatch = new PlayerPokemon(species, 5, 2, 0, Gender.FEMALE, false, 0, [], Nature.MILD);
    let newStarters = await gameData.setPokemonCaught(newCatch, true, false, false);
    expect(newStarters.length).toBe(1);

    // Hatch a shiny Phanpy
    species = getPokemonSpecies(Species.PHANPY);
    newCatch = new PlayerPokemon(species, 5, 0, 0, Gender.MALE, true, 0, [], Nature.QUIET);
    newStarters = await gameData.setPokemonCaught(newCatch, true, true, false);
    expect(newStarters.length).toBe(0);

    expect(gameData.gameStats.pokemonCaught).toBe(1);
    expect(gameData.gameStats.shinyPokemonCaught).toBe(0);
    expect(gameData.gameStats.pokemonHatched).toBe(1);
    expect(gameData.gameStats.shinyPokemonHatched).toBe(1);

    expect(phanpyDexData.caughtCount).toBe(0);
    expect(phanpyDexData.hatchedCount).toBe(1);
    expect(donphanDexData.caughtCount).toBe(1);
    expect(donphanDexData.hatchedCount).toBe(0);

    expect(starterData.candyCount).toBe(11); // 1 candy for standard catch + 5 * 2 candies for shiny hatch
    expect(starterData.abilityAttr & AbilityAttr.ABILITY_1).toBeTruthy();
    expect(starterData.abilityAttr & AbilityAttr.ABILITY_HIDDEN).toBeTruthy();

    // Phanpy data
    expect(phanpyDexData.caughtAttr & DexAttr.NON_SHINY).toBeTruthy();
    expect(phanpyDexData.caughtAttr & DexAttr.SHINY).toBeTruthy();
    expect(phanpyDexData.caughtAttr & DexAttr.DEFAULT_VARIANT).toBeTruthy();
    expect(phanpyDexData.caughtAttr & DexAttr.FEMALE).toBeTruthy();
    expect(phanpyDexData.caughtAttr & DexAttr.MALE).toBeTruthy();
    expect(gameData.getNaturesForAttr(phanpyDexData.natureAttr).length).toBe(2);
    expect(gameData.getNaturesForAttr(phanpyDexData.natureAttr).includes(Nature.MILD)).toBeTruthy();
    expect(gameData.getNaturesForAttr(phanpyDexData.natureAttr).includes(Nature.QUIET)).toBeTruthy();

    // Donphan data
    expect(donphanDexData.caughtAttr & DexAttr.NON_SHINY).toBeTruthy();
    expect(donphanDexData.caughtAttr & DexAttr.SHINY).toBeFalsy();
    expect(donphanDexData.caughtAttr & DexAttr.DEFAULT_VARIANT).toBeTruthy();
    expect(donphanDexData.caughtAttr & DexAttr.FEMALE).toBeTruthy();
    expect(donphanDexData.caughtAttr & DexAttr.MALE).toBeFalsy();
    expect(gameData.getNaturesForAttr(donphanDexData.natureAttr).length).toBe(1);
    expect(gameData.getNaturesForAttr(donphanDexData.natureAttr)[0]).toBe(Nature.MILD);
  });

  it("should not unlock non existing forms for a caught mon's pre-evolutions", async () => {
    await game.scene.initStarterColors();
    const species = getPokemonSpecies(Species.PIKACHU);
    const pichuDexData = gameData.dexData[Species.PICHU];
    const pikachuDexData = gameData.dexData[Species.PIKACHU];

    // Catch cosplay pikachu > no equivalent form in pichu > unlock default form
    const newCatch = new PlayerPokemon(species, 5, 0, 2, Gender.FEMALE, false, 0, [], Nature.MILD);
    const newStarters = await gameData.setPokemonCaught(newCatch, true, false, false);
    expect(newStarters.length).toBe(2);

    expect(pikachuDexData.caughtAttr & gameData.getFormAttr(0)).toBeFalsy();
    expect(pikachuDexData.caughtAttr & gameData.getFormAttr(2)).toBeTruthy(); // cosplay pikachu

    expect(pichuDexData.caughtAttr & gameData.getFormAttr(0)).toBeTruthy();
    expect(pichuDexData.caughtAttr & gameData.getFormAttr(1)).toBeFalsy(); // spiky eared
    expect(pichuDexData.caughtAttr & gameData.getFormAttr(2)).toBeFalsy(); // no pichu form with this index
  });

  it("should unlock the equivalent and valid form of a caught mon's pre-evolutions", async () => {
    await game.scene.initStarterColors();
    const species = getPokemonSpecies(Species.PIKACHU);
    const pichuDexData = gameData.dexData[Species.PICHU];
    const pikachuDexData = gameData.dexData[Species.PIKACHU];

    // Catch partner Pikachu
    let newCatch = new PlayerPokemon(species, 5, 0, 1, Gender.FEMALE, false, 0, [], Nature.MILD);
    let newStarters = await gameData.setPokemonCaught(newCatch, true, false, false);
    expect(newStarters.length).toBe(2);

    expect(pikachuDexData.caughtAttr & gameData.getFormAttr(1)).toBeTruthy(); //partner pikachu
    expect(pichuDexData.caughtAttr & gameData.getFormAttr(0)).toBeFalsy();
    expect(pichuDexData.caughtAttr & gameData.getFormAttr(1)).toBeTruthy(); // spiky eared pichu

    // Catch cosplay pikachu > no equivalent form in pichu > already has a form unlocked > no other form unlock
    newCatch = new PlayerPokemon(species, 5, 0, 5, Gender.FEMALE, false, 0, [], Nature.MILD);
    newStarters = await gameData.setPokemonCaught(newCatch, true, false, false);
    expect(newStarters.length).toBe(0);

    expect(pikachuDexData.caughtAttr & gameData.getFormAttr(0)).toBeFalsy();
    expect(pikachuDexData.caughtAttr & gameData.getFormAttr(1)).toBeTruthy(); // partner pikachu
    expect(pikachuDexData.caughtAttr & gameData.getFormAttr(5)).toBeTruthy(); // cosplay pikachu

    expect(pichuDexData.caughtAttr & gameData.getFormAttr(0)).toBeFalsy();
    expect(pichuDexData.caughtAttr & gameData.getFormAttr(1)).toBeTruthy(); // spiky eared pichu
    expect(pichuDexData.caughtAttr & gameData.getFormAttr(5)).toBeFalsy(); // no pichu form with this index
  });
});
