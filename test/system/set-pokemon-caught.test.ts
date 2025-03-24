import { AbilityAttr, DexAttr } from "#app/data/dex-attributes";
import { PlayerPokemon } from "#app/field/pokemon";
import type { GameData } from "#app/system/game-data";
import { getPokemonSpecies } from "#app/utils/pokemon-species-utils";
import { Gender } from "#enums/gender";
import { Nature } from "#enums/nature";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
import { describe, beforeAll, afterEach, beforeEach, it, expect } from "vitest";

describe("Dex Data - Set Pokemon caught", () => {
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

  it("should update data of caught Pokemon", async () => {
    await game.scene.initStarterColors();
    expect(gameData.gameStats.pokemonCaught).toBe(0);

    const species = getPokemonSpecies(SpeciesId.BULBASAUR);
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

  it("should update data but not stats of rental for already caught Pokemon", async () => {
    await game.scene.initStarterColors();
    expect(gameData.gameStats.pokemonCaught).toBe(0);

    const species = getPokemonSpecies(SpeciesId.BULBASAUR);
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

    // Shiny tier 3 bulbasaur
    const newCatch = new PlayerPokemon(species, 5, 1, 0, Gender.MALE, true, 2, [], Nature.MODEST);
    const newStarters = await gameData.setPokemonCaught(newCatch, false, false, false);
    expect(newStarters.length).toBe(0);

    // These should not update for rental Pokemon
    expect(gameData.gameStats.pokemonCaught).toBe(0);
    expect(starterData.candyCount).toBe(0);
    expect(dexData.caughtCount).toBe(0);

    // These should update for rental Pokemon
    expect(starterData.abilityAttr & AbilityAttr.ABILITY_2).toBeTruthy();
    expect(dexData.caughtAttr & DexAttr.SHINY).toBeTruthy();
    expect(dexData.caughtAttr & DexAttr.VARIANT_3).toBeTruthy();
    expect(gameData.getNaturesForAttr(dexData.natureAttr).length).toBe(2);
    expect(gameData.getNaturesForAttr(dexData.natureAttr).includes(Nature.MODEST)).toBeTruthy();
  });

  it("should update nothing for rental, not already caught Pokemon", async () => {
    await game.scene.initStarterColors();
    expect(gameData.gameStats.pokemonCaught).toBe(0);

    const species = getPokemonSpecies(SpeciesId.MEWTWO);
    const dexData = gameData.dexData[species.speciesId];
    const starterData = gameData.starterData[species.getRootSpeciesId()];

    expect(dexData.caughtCount).toBe(0);
    expect(dexData.hatchedCount).toBe(0);
    expect(dexData.caughtAttr).toBeFalsy();
    expect(starterData.candyCount).toBe(0);
    expect(starterData.abilityAttr).toBeFalsy();
    expect(gameData.getNaturesForAttr(dexData.natureAttr).length).toBe(0);

    // Shiny tier 3 mewtwo
    const newCatch = new PlayerPokemon(species, 5, 1, 0, Gender.GENDERLESS, true, 2, [], Nature.MODEST);
    const newStarters = await gameData.setPokemonCaught(newCatch, false, false, false);
    expect(newStarters.length).toBe(0);

    // no data should have been updated
    expect(gameData.gameStats.pokemonCaught).toBe(0);
    expect(dexData.caughtCount).toBe(0);
    expect(dexData.hatchedCount).toBe(0);
    expect(dexData.caughtAttr).toBeFalsy();
    expect(starterData.candyCount).toBe(0);
    expect(starterData.abilityAttr).toBeFalsy();
    expect(gameData.getNaturesForAttr(dexData.natureAttr).length).toBe(0);
  });

  it("should update data for a caught Pokemon's pre-evolutions", async () => {
    await game.scene.initStarterColors();
    expect(gameData.gameStats.pokemonCaught).toBe(0);
    expect(gameData.gameStats.shinyPokemonCaught).toBe(0);

    const starterData = gameData.starterData[SpeciesId.BULBASAUR];
    expect(starterData.candyCount).toBe(0);
    expect(starterData.abilityAttr & AbilityAttr.ABILITY_1).toBeTruthy();
    expect(starterData.abilityAttr & AbilityAttr.ABILITY_2).toBeFalsy();
    expect(starterData.abilityAttr & AbilityAttr.ABILITY_HIDDEN).toBeFalsy();

    const bulbaDexData = gameData.dexData[SpeciesId.BULBASAUR];
    const ivyDexData = gameData.dexData[SpeciesId.IVYSAUR];
    const venuDexData = gameData.dexData[SpeciesId.VENUSAUR];

    [ivyDexData, venuDexData].forEach((dexData) => {
      expect(dexData.caughtCount).toBe(0);
      expect(dexData.hatchedCount).toBe(0);
      expect(dexData.caughtAttr).toBeFalsy();
      expect(gameData.getNaturesForAttr(dexData.natureAttr).length).toBe(0);
    });

    // Catch shiny tier 2 a Venusaur
    const species = getPokemonSpecies(SpeciesId.VENUSAUR);
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

    const starterData = gameData.starterData[SpeciesId.PHANPY];
    for (const ability of Object.values(AbilityAttr)) {
      expect(starterData.abilityAttr & ability).toBeFalsy();
    }
    expect(starterData.candyCount).toBe(0);

    const phanpyDexData = gameData.dexData[SpeciesId.PHANPY];
    const donphanDexData = gameData.dexData[SpeciesId.DONPHAN];

    [phanpyDexData, donphanDexData].forEach((dexData) => {
      expect(dexData.caughtCount).toBe(0);
      expect(dexData.hatchedCount).toBe(0);
      expect(dexData.caughtAttr).toBeFalsy();
      expect(gameData.getNaturesForAttr(dexData.natureAttr).length).toBe(0);
    });

    // Catch a donphan, should unlock phanpy as a starter
    let species = getPokemonSpecies(SpeciesId.DONPHAN);
    let newCatch = new PlayerPokemon(species, 5, 2, 0, Gender.FEMALE, false, 0, [], Nature.MILD);
    let newStarters = await gameData.setPokemonCaught(newCatch, true, false, false);
    expect(newStarters).toStrictEqual([SpeciesId.PHANPY]);

    // Hatch a shiny Phanpy
    species = getPokemonSpecies(SpeciesId.PHANPY);
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
    const species = getPokemonSpecies(SpeciesId.PIKACHU);
    const pichuDexData = gameData.dexData[SpeciesId.PICHU];
    const pikachuDexData = gameData.dexData[SpeciesId.PIKACHU];

    // Catch cosplay pikachu > no equivalent form in pichu > unlock default form
    const newCatch = new PlayerPokemon(species, 5, 0, 2, Gender.FEMALE, false, 0, [], Nature.MILD);
    const newStarters = await gameData.setPokemonCaught(newCatch, true, false, false);
    expect(newStarters).toStrictEqual([SpeciesId.PIKACHU, SpeciesId.PICHU]);

    expect(pikachuDexData.caughtAttr & gameData.getFormAttr(0)).toBeFalsy();
    expect(pikachuDexData.caughtAttr & gameData.getFormAttr(2)).toBeTruthy(); // cosplay pikachu

    expect(pichuDexData.caughtAttr & gameData.getFormAttr(0)).toBeTruthy();
    expect(pichuDexData.caughtAttr & gameData.getFormAttr(1)).toBeFalsy(); // spiky eared
    expect(pichuDexData.caughtAttr & gameData.getFormAttr(2)).toBeFalsy(); // no pichu form with this index
  });

  it("should unlock the equivalent and valid form of a caught mon's pre-evolutions", async () => {
    await game.scene.initStarterColors();
    const species = getPokemonSpecies(SpeciesId.PIKACHU);
    const pichuDexData = gameData.dexData[SpeciesId.PICHU];
    const pikachuDexData = gameData.dexData[SpeciesId.PIKACHU];

    // Catch partner Pikachu
    let newCatch = new PlayerPokemon(species, 5, 0, 1, Gender.FEMALE, false, 0, [], Nature.MILD);
    let newStarters = await gameData.setPokemonCaught(newCatch, true, false, false);
    expect(newStarters).toStrictEqual([SpeciesId.PIKACHU, SpeciesId.PICHU]);

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

  it("should not mark non starter selectable forms as caught", async () => {
    await game.scene.initStarterColors();
    const species = getPokemonSpecies(SpeciesId.EEVEE);
    const dexData = gameData.dexData[species.speciesId];

    expect(dexData.caughtAttr).toBeFalsy();

    // Catch GMax eevee
    const newCatch = new PlayerPokemon(species, 5, 0, 2, Gender.FEMALE, false, 0, [], Nature.MILD);
    const newStarters = await gameData.setPokemonCaught(newCatch, true, false, false);

    expect(newStarters).toStrictEqual([SpeciesId.EEVEE]);
    expect(newCatch.formIndex).toBe(2);
    expect(newCatch.getSpeciesForm().isStarterSelectable).toBeFalsy();

    expect(dexData.caughtAttr & gameData.getFormAttr(0)).toBeTruthy(); // normal eevee
    expect(dexData.caughtAttr & gameData.getFormAttr(1)).toBeFalsy(); // partner eevee
    expect(dexData.caughtAttr & gameData.getFormAttr(2)).toBeFalsy(); // gmax eevee
  });

  it.each([
    { formIndex: 0, formName: "Male", gender: Gender.MALE },
    { formIndex: 1, formName: "Female", gender: Gender.FEMALE },
  ])("should unlock White-striped Basculin when catching $formName Basculegion", async ({ formIndex, gender }) => {
    await game.scene.initStarterColors();
    const species = getPokemonSpecies(SpeciesId.BASCULEGION);
    const basculegionDexData = gameData.dexData[SpeciesId.BASCULEGION];
    const basculinDexData = gameData.dexData[SpeciesId.BASCULIN];

    expect(basculinDexData.caughtAttr).toBeFalsy();
    expect(basculegionDexData.caughtAttr).toBeFalsy();

    const newCatch = new PlayerPokemon(species, 5, 0, formIndex, gender, false, 0, [], Nature.MILD);
    const newStarters = await gameData.setPokemonCaught(newCatch, true, false, false);

    expect(newStarters).toStrictEqual([SpeciesId.BASCULIN]);
    expect(newCatch.formIndex).toBe(formIndex);

    expect(basculegionDexData.caughtAttr & gameData.getFormAttr(0)).toBeTruthy(); // male
    expect(basculegionDexData.caughtAttr & gameData.getFormAttr(1)).toBeFalsy(); // female

    expect(basculinDexData.caughtAttr & gameData.getFormAttr(0)).toBeTruthy(); // white striped
    expect(basculinDexData.caughtAttr & gameData.getFormAttr(1)).toBeFalsy(); // red striped
    expect(basculinDexData.caughtAttr & gameData.getFormAttr(2)).toBeFalsy(); // blue striped
  });

  it("should unlock Battle-bond Froakie when catching Ash form Greninja", async () => {
    await game.scene.initStarterColors();
    const species = getPokemonSpecies(SpeciesId.GRENINJA);
    const greninjaDexData = gameData.dexData[SpeciesId.GRENINJA];
    const frogadierDexData = gameData.dexData[SpeciesId.FROGADIER];
    const froakieDexData = gameData.dexData[SpeciesId.FROAKIE];

    expect(froakieDexData.caughtAttr & gameData.getFormAttr(0)).toBeTruthy();
    expect(froakieDexData.caughtAttr & gameData.getFormAttr(1)).toBeFalsy();
    expect(greninjaDexData.caughtAttr).toBeFalsy();
    expect(frogadierDexData.caughtAttr).toBeFalsy();

    // Catch Ash form Greninja
    const newCatch = new PlayerPokemon(species, 5, 0, 2, Gender.FEMALE, false, 0, [], Nature.MILD);
    const newStarters = await gameData.setPokemonCaught(newCatch, true, false, false);

    expect(newStarters.length).toBe(0);
    expect(newCatch.formIndex).toBe(2);
    expect(newCatch.getSpeciesForm().isStarterSelectable).toBeFalsy();

    expect(froakieDexData.caughtAttr & gameData.getFormAttr(0)).toBeTruthy(); // normal form
    expect(froakieDexData.caughtAttr & gameData.getFormAttr(1)).toBeTruthy(); // battle bond form
    expect(froakieDexData.caughtAttr & gameData.getFormAttr(2)).toBeFalsy(); // non existing ash form
    [frogadierDexData, greninjaDexData].forEach((dexData) => {
      expect(dexData.caughtAttr & gameData.getFormAttr(0)).toBeFalsy(); // normal form
      expect(dexData.caughtAttr & gameData.getFormAttr(1)).toBeTruthy(); // battle bond form
      expect(dexData.caughtAttr & gameData.getFormAttr(2)).toBeFalsy(); // ash form
    });
  });

  it("should unlock Own Tempo Rockruff when catching Dusk form Lycanroc", async () => {
    await game.scene.initStarterColors();
    const species = getPokemonSpecies(SpeciesId.LYCANROC);
    const lycanrocDexData = gameData.dexData[SpeciesId.LYCANROC];
    const rockruffDexData = gameData.dexData[SpeciesId.ROCKRUFF];

    expect(rockruffDexData.caughtAttr).toBeFalsy();
    expect(lycanrocDexData.caughtAttr).toBeFalsy();

    // Catch Dusk form Lycanroc
    const newCatch = new PlayerPokemon(species, 5, 0, 1, Gender.FEMALE, false, 0, [], Nature.MILD);
    const newStarters = await gameData.setPokemonCaught(newCatch, true, false, false);

    expect(species.forms[newCatch.formIndex].formName).toBe("Dusk Form");
    expect(newStarters).toStrictEqual([SpeciesId.ROCKRUFF]);
    expect(newCatch.formIndex).toBe(1);

    expect(rockruffDexData.caughtAttr & gameData.getFormAttr(0)).toBeFalsy(); // normal form
    expect(rockruffDexData.caughtAttr & gameData.getFormAttr(1)).toBeTruthy(); // own tempo

    expect(lycanrocDexData.caughtAttr & gameData.getFormAttr(0)).toBeFalsy(); // midday
    expect(lycanrocDexData.caughtAttr & gameData.getFormAttr(1)).toBeTruthy(); // dusk
    expect(lycanrocDexData.caughtAttr & gameData.getFormAttr(2)).toBeFalsy(); // midnight
  });

  it.each([
    {
      caughtFormIndex: 4,
      caughtFormName: "Complete Forme (50% PC)",
      unlockedFormIndex: 2,
      unlockedFormName: "50% Forme Power Construct",
    },
    {
      caughtFormIndex: 5,
      caughtFormName: "Complete Forme (10% PC)",
      unlockedFormIndex: 3,
      unlockedFormName: "10% Forme Power Construct",
    },
  ])(
    "should unlock $unlockedFormName when catching $caughtFormName Zygarde",
    async ({ caughtFormIndex, caughtFormName, unlockedFormIndex, unlockedFormName }) => {
      await game.scene.initStarterColors();
      const species = getPokemonSpecies(SpeciesId.ZYGARDE);
      const zygardeDexData = gameData.dexData[species.speciesId];

      expect(zygardeDexData.caughtAttr).toBeFalsy();
      expect(species.forms[caughtFormIndex].formName).toBe(caughtFormName);
      expect(species.forms[caughtFormIndex].isStarterSelectable).toBeFalsy();
      expect(species.forms[unlockedFormIndex].formName).toBe(unlockedFormName);
      expect(species.forms[unlockedFormIndex].isStarterSelectable).toBeTruthy();

      const newCatch = new PlayerPokemon(species, 5, 0, caughtFormIndex, Gender.GENDERLESS, false, 0, [], Nature.MILD);
      const newStarters = await gameData.setPokemonCaught(newCatch, true, false, false);

      expect(newStarters).toStrictEqual([SpeciesId.ZYGARDE]);
      expect(newCatch.formIndex).toBe(caughtFormIndex);

      expect(zygardeDexData.caughtAttr & gameData.getFormAttr(unlockedFormIndex)).toBeTruthy();
      expect(zygardeDexData.caughtAttr & gameData.getFormAttr(caughtFormIndex)).toBeFalsy();
    },
  );
});
