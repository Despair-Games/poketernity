import type BattleScene from "#app/battle-scene";
import { AbilityId } from "#enums/ability-id";
import { BerryType } from "#enums/berry-type";
import { BiomeId } from "#enums/biome-id";
import { Button } from "#enums/button";
import { ElementalType } from "#enums/elemental-type";
import { ModifierTier } from "#enums/modifier-tier";
import { MoveId } from "#enums/move-id";
import { MysteryEncounterOptionMode } from "#enums/mystery-encounter-option-mode";
import { MysteryEncounterTier } from "#enums/mystery-encounter-tier";
import { MysteryEncounterType } from "#enums/mystery-encounter-type";
import { SpeciesId } from "#enums/species-id";
import { TrainerType } from "#enums/trainer-type";
import { UiMode } from "#enums/ui-mode";
import type { Pokemon } from "#field/pokemon";
import { PokemonMove } from "#field/pokemon-move";
import * as InitMoveAnim from "#init/init-move-anim";
import type { PokemonHeldItemModifier } from "#modifier/modifier";
import type { PokemonHeldItemModifierType } from "#modifier/modifier-type";
import { modifierTypes } from "#modifier/modifier-types";
import { ClowningAroundEncounter } from "#mystery-encounters/clowning-around-encounter";
import * as EncounterPhaseUtils from "#mystery-encounters/encounter-phase-utils";
import { generateModifierType } from "#mystery-encounters/encounter-phase-utils";
import * as MysteryEncounters from "#mystery-encounters/mystery-encounters";
import type { MovePhase } from "#phases/move-phase";
import {
  runMysteryEncounterToEnd,
  runSelectMysteryEncounterOption,
  skipBattleRunMysteryEncounterRewardsPhase,
} from "#test/mystery-encounter/encounter-test-utils";
import { GameManager } from "#test/test-utils/game-manager";
import { initSceneWithoutEncounterPhase } from "#test/test-utils/game-manager-utils";
import * as MoveAnimUtils from "#utils/move-anim-utils";
import { getPokemonSpecies } from "#utils/pokemon-utils";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const namespace = "mysteryEncounters/clowningAround";
const defaultParty = [SpeciesId.LAPRAS, SpeciesId.GENGAR, SpeciesId.ABRA];
const defaultBiome = BiomeId.CAVE;
const defaultWave = 45;

describe("Clowning Around - Mystery Encounter", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;
  let scene: BattleScene;

  beforeAll(() => {
    phaserGame = new Phaser.Game({ type: Phaser.HEADLESS });
  });

  beforeEach(async () => {
    game = new GameManager(phaserGame);
    scene = game.scene;
    game.override.mysteryEncounterChance(100).startingWave(defaultWave).startingBiome(defaultBiome).trainerChance(0);

    vi.spyOn(MysteryEncounters, "mysteryEncountersByBiome", "get").mockReturnValue(
      new Map<BiomeId, MysteryEncounterType[]>([[BiomeId.CAVE, [MysteryEncounterType.CLOWNING_AROUND]]]),
    );
  });

  afterEach(() => {
    game.phaseInterceptor.restoreOg();
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  it("should have the correct properties", async () => {
    await game.runToMysteryEncounter(MysteryEncounterType.CLOWNING_AROUND, defaultParty);

    expect(ClowningAroundEncounter.encounterType).toBe(MysteryEncounterType.CLOWNING_AROUND);
    expect(ClowningAroundEncounter.encounterTier).toBe(MysteryEncounterTier.ULTRA);
    expect(ClowningAroundEncounter.dialogue).toBeDefined();
    expect(ClowningAroundEncounter.dialogue.intro).toStrictEqual([
      { text: `${namespace}:intro` },
      {
        speaker: `${namespace}:speaker`,
        text: `${namespace}:intro_dialogue`,
      },
    ]);
    expect(ClowningAroundEncounter.dialogue.encounterOptionsDialogue?.title).toBe(`${namespace}:title`);
    expect(ClowningAroundEncounter.dialogue.encounterOptionsDialogue?.description).toBe(`${namespace}:description`);
    expect(ClowningAroundEncounter.dialogue.encounterOptionsDialogue?.query).toBe(`${namespace}:query`);
    expect(ClowningAroundEncounter.options.length).toBe(3);
  });

  it("should not run below wave 80", async () => {
    game.override.startingWave(79);

    await game.runToMysteryEncounter();

    expect(scene.currentBattle?.mysteryEncounter?.encounterType).not.toBe(MysteryEncounterType.CLOWNING_AROUND);
  });

  it("should initialize fully", async () => {
    initSceneWithoutEncounterPhase(scene, defaultParty);
    scene.currentBattle.mysteryEncounter = ClowningAroundEncounter;
    const moveInitSpy = vi.spyOn(InitMoveAnim, "initMoveAnim");
    const moveLoadSpy = vi.spyOn(MoveAnimUtils, "loadMoveAnimAssets");

    const { onInit } = ClowningAroundEncounter;

    expect(ClowningAroundEncounter.onInit).toBeDefined();

    ClowningAroundEncounter.populateDialogueTokensFromRequirements();
    const onInitResult = onInit!();
    const config = ClowningAroundEncounter.enemyPartyConfigs[0];

    expect(config.doubleBattle).toBe(true);
    expect(config.trainerConfig?.trainerType).toBe(TrainerType.HARLEQUIN);
    expect(config.pokemonConfigs?.[0]).toEqual({
      species: getPokemonSpecies(SpeciesId.MR_MIME),
      isBoss: true,
      moveSet: [MoveId.TEETER_DANCE, MoveId.ALLY_SWITCH, MoveId.DAZZLING_GLEAM, MoveId.PSYCHIC],
    });
    expect(config.pokemonConfigs?.[1]).toEqual({
      species: getPokemonSpecies(SpeciesId.BLACEPHALON),
      customPokemonData: expect.anything(),
      isBoss: true,
      moveSet: [MoveId.TRICK, MoveId.HYPNOSIS, MoveId.SHADOW_BALL, MoveId.MIND_BLOWN],
    });
    expect(config.pokemonConfigs?.[1].customPokemonData?.types.length).toBe(2);
    expect([
      AbilityId.STURDY,
      AbilityId.PICKUP,
      AbilityId.INTIMIDATE,
      AbilityId.GUTS,
      AbilityId.DROUGHT,
      AbilityId.DRIZZLE,
      AbilityId.SNOW_WARNING,
      AbilityId.SAND_STREAM,
      AbilityId.ELECTRIC_SURGE,
      AbilityId.PSYCHIC_SURGE,
      AbilityId.GRASSY_SURGE,
      AbilityId.MISTY_SURGE,
      AbilityId.MAGICIAN,
      AbilityId.SHEER_FORCE,
      AbilityId.PRANKSTER,
    ]).toContain(config.pokemonConfigs?.[1].customPokemonData?.ability);
    expect(ClowningAroundEncounter.misc.ability).toBe(config.pokemonConfigs?.[1].customPokemonData?.ability);
    await vi.waitFor(() => expect(moveInitSpy).toHaveBeenCalled());
    await vi.waitFor(() => expect(moveLoadSpy).toHaveBeenCalled());
    expect(onInitResult).toBe(true);
  });

  describe("Option 1 - Battle the Clown", () => {
    it("should have the correct properties", () => {
      const option = ClowningAroundEncounter.options[0];
      expect(option.optionMode).toBe(MysteryEncounterOptionMode.DEFAULT);
      expect(option.dialogue).toBeDefined();
      expect(option.dialogue).toStrictEqual({
        buttonLabel: `${namespace}:option.1.label`,
        buttonTooltip: `${namespace}:option.1.tooltip`,
        selected: [
          {
            speaker: `${namespace}:speaker`,
            text: `${namespace}:option.1.selected`,
          },
        ],
      });
    });

    it("should start double battle against the clown", async () => {
      const phaseSpy = vi.spyOn(scene.phaseManager, "pushPhase");

      await game.runToMysteryEncounter(MysteryEncounterType.CLOWNING_AROUND, defaultParty);
      await runMysteryEncounterToEnd(game, 1, undefined, true);

      const enemyField = scene.getEnemyField();
      expect(scene.phaseManager.getCurrentPhase()?.phaseName).toBe("CommandPhase");
      expect(enemyField.length).toBe(2);
      expect(enemyField[0].species.speciesId).toBe(SpeciesId.MR_MIME);
      expect(enemyField[0].moveset).toEqual([
        new PokemonMove(MoveId.TEETER_DANCE),
        new PokemonMove(MoveId.ALLY_SWITCH),
        new PokemonMove(MoveId.DAZZLING_GLEAM),
        new PokemonMove(MoveId.PSYCHIC),
      ]);
      expect(enemyField[1].species.speciesId).toBe(SpeciesId.BLACEPHALON);
      expect(enemyField[1].moveset).toEqual([
        new PokemonMove(MoveId.TRICK),
        new PokemonMove(MoveId.HYPNOSIS),
        new PokemonMove(MoveId.SHADOW_BALL),
        new PokemonMove(MoveId.MIND_BLOWN),
      ]);

      // Should have used moves pre-battle
      const movePhases = phaseSpy.mock.calls.filter((p) => p[0].is("MovePhase")).map((p) => p[0]);
      expect(movePhases.length).toBe(3);
      expect(movePhases.filter((p) => (p as MovePhase).move.moveId === MoveId.ROLE_PLAY).length).toBe(1);
      expect(movePhases.filter((p) => (p as MovePhase).move.moveId === MoveId.TAUNT).length).toBe(2);
    });

    it("should advance exactly one wave if the clown's Pokemon get defeated simultaneously", async () => {
      // Prevent test from failing due to the clown randomly picking the ability Sturdy
      game.override.startingLevel(1000).enemyAbility(AbilityId.BALL_FETCH);

      await game.runToMysteryEncounter(MysteryEncounterType.CLOWNING_AROUND, [SpeciesId.FEEBAS]);
      await runSelectMysteryEncounterOption(game, 1);

      game.move.use(MoveId.DAZZLING_GLEAM);
      await game.phaseInterceptor.to("MysteryEncounterRewardsPhase");

      expect(game.scene.phaseManager.hasPhase((phase) => phase.is("MysteryEncounterRewardsPhase"), true)).toBe(false);
    });

    it("should let the player gain the ability after battle completion", async () => {
      await game.runToMysteryEncounter(MysteryEncounterType.CLOWNING_AROUND, defaultParty);
      await runMysteryEncounterToEnd(game, 1, undefined, true);
      await skipBattleRunMysteryEncounterRewardsPhase(game);
      await game.phaseInterceptor.to("SelectModifierPhase", false);
      expect(scene.phaseManager.getCurrentPhase()?.phaseName).toBe("SelectModifierPhase");
      await game.phaseInterceptor.to("SelectModifierPhase");
      const abilityToTrain = scene.currentBattle.mysteryEncounter?.misc.ability;

      // Clear out prompt handlers created by `runMysteryEncounterToEnd`.
      // TODO: refactor the prompt handler queue to add these handler at the front of the queue instead.
      game.phaseInterceptor["prompts"] = [];

      // Select "Yes" on train ability
      game.onNextPrompt("PostMysteryEncounterPhase", UiMode.CONFIRM, () => {
        game.scene.ui.getCurrentHandler().processInput(Button.ACTION);
      });

      // Select first pokemon in party to train
      game.onNextPrompt("PostMysteryEncounterPhase", UiMode.PARTY, () => {
        game.scene.ui.getCurrentHandler().processInput(Button.ACTION); // open Pokemon sub menu
        game.scene.ui.getCurrentHandler().processInput(Button.ACTION); // 'Select'
      });

      game.endPhase();
      await game.phaseInterceptor.to("PostMysteryEncounterPhase");
      expect(scene.phaseManager.getCurrentPhase()?.phaseName).toBe("PostMysteryEncounterPhase");

      await game.phaseInterceptor.to("NewBattlePhase", false);

      const leadPokemon = scene.getPlayerParty()[0];
      expect(leadPokemon.customPokemonData?.ability).toBe(abilityToTrain);
    });
  });

  describe("Option 2 - Remain Unprovoked", () => {
    it("should have the correct properties", () => {
      const option = ClowningAroundEncounter.options[1];
      expect(option.optionMode).toBe(MysteryEncounterOptionMode.DEFAULT);
      expect(option.dialogue).toBeDefined();
      expect(option.dialogue).toStrictEqual({
        buttonLabel: `${namespace}:option.2.label`,
        buttonTooltip: `${namespace}:option.2.tooltip`,
        selected: [
          {
            speaker: `${namespace}:speaker`,
            text: `${namespace}:option.2.selected`,
          },
          {
            text: `${namespace}:option.2.selected_2`,
          },
          {
            speaker: `${namespace}:speaker`,
            text: `${namespace}:option.2.selected_3`,
          },
        ],
      });
    });

    it("should randomize held items of the Pokemon with the most items, and not the held items of other pokemon", async () => {
      await game.runToMysteryEncounter(MysteryEncounterType.CLOWNING_AROUND, defaultParty);

      // Set some moves on party for attack type booster generation
      scene.getPlayerParty()[0].moveset = [new PokemonMove(MoveId.TACKLE), new PokemonMove(MoveId.THIEF)];

      // 2 Sitrus Berries on lead
      scene.modifiers = [];
      let itemType = generateModifierType(modifierTypes.BERRY, [BerryType.SITRUS]) as PokemonHeldItemModifierType;
      await addItemToPokemon(scene, scene.getPlayerParty()[0], 2, itemType);
      // 2 Ganlon Berries on lead
      itemType = generateModifierType(modifierTypes.BERRY, [BerryType.GANLON]) as PokemonHeldItemModifierType;
      await addItemToPokemon(scene, scene.getPlayerParty()[0], 2, itemType);
      // 5 Golden Punch on lead (ultra)
      itemType = generateModifierType(modifierTypes.GOLDEN_PUNCH) as PokemonHeldItemModifierType;
      await addItemToPokemon(scene, scene.getPlayerParty()[0], 5, itemType);
      // 5 Lucky Egg on lead (ultra)
      itemType = generateModifierType(modifierTypes.LUCKY_EGG) as PokemonHeldItemModifierType;
      await addItemToPokemon(scene, scene.getPlayerParty()[0], 5, itemType);
      // 3 Soothe Bell on lead (great tier, but counted as ultra by this ME)
      itemType = generateModifierType(modifierTypes.SOOTHE_BELL) as PokemonHeldItemModifierType;
      await addItemToPokemon(scene, scene.getPlayerParty()[0], 3, itemType);
      // 5 Soul Dew on lead (epic)
      itemType = generateModifierType(modifierTypes.SOUL_DEW) as PokemonHeldItemModifierType;
      await addItemToPokemon(scene, scene.getPlayerParty()[0], 5, itemType);
      // 2 Golden Egg on lead (epic)
      itemType = generateModifierType(modifierTypes.GOLDEN_EGG) as PokemonHeldItemModifierType;
      await addItemToPokemon(scene, scene.getPlayerParty()[0], 2, itemType);

      // 5 Soul Dew on second party pokemon (these should not change)
      itemType = generateModifierType(modifierTypes.SOUL_DEW) as PokemonHeldItemModifierType;
      await addItemToPokemon(scene, scene.getPlayerParty()[1], 5, itemType);

      await runMysteryEncounterToEnd(game, 2);

      const leadItemsAfter = scene.getPlayerParty()[0].getHeldItems();
      const ultraCountAfter = leadItemsAfter
        .filter((m) => m.type.tier === ModifierTier.ULTRA)
        .reduce((a, b) => a + b.stackCount, 0);
      const epicCountAfter = leadItemsAfter
        .filter((m) => m.type.tier === ModifierTier.EPIC)
        .reduce((a, b) => a + b.stackCount, 0);
      expect(ultraCountAfter).toBe(13);
      expect(epicCountAfter).toBe(7);

      const secondItemsAfter = scene.getPlayerParty()[1].getHeldItems();
      expect(secondItemsAfter.length).toBe(1);
      expect(secondItemsAfter[0].type.id).toBe("SOUL_DEW");
      expect(secondItemsAfter[0]?.stackCount).toBe(5);
    });

    it("should leave encounter without battle", async () => {
      const leaveEncounterWithoutBattleSpy = vi.spyOn(EncounterPhaseUtils, "leaveEncounterWithoutBattle");

      await game.runToMysteryEncounter(MysteryEncounterType.CLOWNING_AROUND, defaultParty);
      await runMysteryEncounterToEnd(game, 2);

      expect(leaveEncounterWithoutBattleSpy).toBeCalled();
    });
  });

  describe("Option 3 - Return the Insults", () => {
    it("should have the correct properties", () => {
      const option = ClowningAroundEncounter.options[2];
      expect(option.optionMode).toBe(MysteryEncounterOptionMode.DEFAULT);
      expect(option.dialogue).toBeDefined();
      expect(option.dialogue).toStrictEqual({
        buttonLabel: `${namespace}:option.3.label`,
        buttonTooltip: `${namespace}:option.3.tooltip`,
        selected: [
          {
            speaker: `${namespace}:speaker`,
            text: `${namespace}:option.3.selected`,
          },
          {
            text: `${namespace}:option.3.selected_2`,
          },
          {
            speaker: `${namespace}:speaker`,
            text: `${namespace}:option.3.selected_3`,
          },
        ],
      });
    });

    it("should randomize the pokemon types of the party", async () => {
      await game.runToMysteryEncounter(MysteryEncounterType.CLOWNING_AROUND, defaultParty);

      // Same type moves on lead
      scene.getPlayerParty()[0].moveset = [new PokemonMove(MoveId.ICE_BEAM), new PokemonMove(MoveId.SURF)];
      // Different type moves on second
      scene.getPlayerParty()[1].moveset = [new PokemonMove(MoveId.GRASS_KNOT), new PokemonMove(MoveId.ELECTRO_BALL)];
      // No moves on third
      scene.getPlayerParty()[2].moveset = [];
      await runMysteryEncounterToEnd(game, 3);

      const leadTypesAfter = scene.getPlayerParty()[0].customPokemonData?.types;
      const secondaryTypesAfter = scene.getPlayerParty()[1].customPokemonData?.types;
      const thirdTypesAfter = scene.getPlayerParty()[2].customPokemonData?.types;

      expect(leadTypesAfter.length).toBe(2);
      expect(leadTypesAfter[0]).toBe(ElementalType.WATER);
      expect([ElementalType.WATER, ElementalType.ICE]).not.toContain(leadTypesAfter[1]);
      expect(secondaryTypesAfter.length).toBe(2);
      expect(secondaryTypesAfter[0]).toBe(ElementalType.GHOST);
      expect([ElementalType.GHOST, ElementalType.POISON]).not.toContain(secondaryTypesAfter[1]);
      expect([ElementalType.GRASS, ElementalType.ELECTRIC]).toContain(secondaryTypesAfter[1]);
      expect(thirdTypesAfter.length).toBe(2);
      expect(thirdTypesAfter[0]).toBe(ElementalType.PSYCHIC);
      expect(secondaryTypesAfter[1]).not.toBe(ElementalType.PSYCHIC);
    });

    it("should leave encounter without battle", async () => {
      const leaveEncounterWithoutBattleSpy = vi.spyOn(EncounterPhaseUtils, "leaveEncounterWithoutBattle");

      await game.runToMysteryEncounter(MysteryEncounterType.CLOWNING_AROUND, defaultParty);
      await runMysteryEncounterToEnd(game, 3);

      expect(leaveEncounterWithoutBattleSpy).toBeCalled();
    });
  });
});

async function addItemToPokemon(
  scene: BattleScene,
  pokemon: Pokemon,
  stackCount: number,
  itemType: PokemonHeldItemModifierType,
) {
  const itemMod = itemType.newModifier(pokemon) as PokemonHeldItemModifier;
  itemMod.stackCount = stackCount;
  scene.addModifier(itemMod, true, false, false, true);
  await scene.updateModifiers(true);
}
