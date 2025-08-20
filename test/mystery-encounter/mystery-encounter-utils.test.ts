import type { BattleScene } from "#app/battle-scene";
import { speciesStarterCosts } from "#data/starters";
import { ElementalType } from "#enums/elemental-type";
import { SpeciesId } from "#enums/species-id";
import {
  getEncounterText,
  queueEncounterMessage,
  showEncounterDialogue,
  showEncounterText,
} from "#mystery-encounters/encounter-dialogue-utils";
import {
  getHighestLevelPlayerPokemon,
  getLowestLevelPlayerPokemon,
  getRandomPlayerPokemon,
  getRandomSpeciesByStarterCost,
  koPlayerPokemon,
} from "#mystery-encounters/encounter-pokemon-utils";
import { MysteryEncounter } from "#mystery-encounters/mystery-encounter";
import { GameManager } from "#test/test-utils/game-manager";
import { initSceneWithoutEncounterPhase } from "#test/test-utils/game-manager-utils";
import { getPokemonSpecies } from "#utils/pokemon-utils";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Mystery Encounter Utils", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;
  let scene: BattleScene;

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
    scene = game.scene;
    initSceneWithoutEncounterPhase(game.scene, [SpeciesId.ARCEUS, SpeciesId.MANAPHY]);
  });

  describe("getRandomPlayerPokemon", () => {
    it("gets a random pokemon from player party", () => {
      // Seeds are calculated to return index 0 first, 1 second (if both pokemon are legal)
      game.override.seed("random");

      let result = getRandomPlayerPokemon();
      expect(result.species.speciesId).toBe(SpeciesId.MANAPHY);

      game.override.seed("random2");

      result = getRandomPlayerPokemon();
      expect(result.species.speciesId).toBe(SpeciesId.ARCEUS);
    });

    it("gets a fainted pokemon from player party if isAllowedInBattle is false", async () => {
      // Both pokemon fainted
      for (const pkmn of scene.getPlayerParty()) {
        pkmn.faint();
        await pkmn.updateInfo();
      }

      // Seeds are calculated to return index 0 first, 1 second (if both pokemon are legal)
      game.override.seed("random");

      let result = getRandomPlayerPokemon();
      expect(result.species.speciesId).toBe(SpeciesId.MANAPHY);

      game.override.seed("random2");

      result = getRandomPlayerPokemon();
      expect(result.species.speciesId).toBe(SpeciesId.ARCEUS);
    });

    it("gets an unfainted legal pokemon from player party if isAllowed is true and isFainted is false", async () => {
      // Only faint 1st pokemon
      const party = scene.getPlayerParty();
      party[0].faint();
      await party[0].updateInfo();

      // Seeds are calculated to return index 0 first, 1 second (if both pokemon are legal)
      game.override.seed("random");

      let result = getRandomPlayerPokemon(true);
      expect(result.species.speciesId).toBe(SpeciesId.MANAPHY);

      game.override.seed("random2");

      result = getRandomPlayerPokemon(true);
      expect(result.species.speciesId).toBe(SpeciesId.MANAPHY);
    });

    it("returns last unfainted pokemon if doNotReturnLastAbleMon is false", async () => {
      // Only faint 1st pokemon
      const party = scene.getPlayerParty();
      party[0].faint();
      await party[0].updateInfo();

      // Seeds are calculated to return index 0 first, 1 second (if both pokemon are legal)
      game.override.seed("random");

      let result = getRandomPlayerPokemon(true, false);
      expect(result.species.speciesId).toBe(SpeciesId.MANAPHY);

      game.override.seed("random2");

      result = getRandomPlayerPokemon(true, false);
      expect(result.species.speciesId).toBe(SpeciesId.MANAPHY);
    });

    it("never returns last unfainted pokemon if doNotReturnLastAbleMon is true", async () => {
      // Only faint 1st pokemon
      const party = scene.getPlayerParty();
      party[0].faint();
      await party[0].updateInfo();

      // Seeds are calculated to return index 0 first, 1 second (if both pokemon are legal)
      game.override.seed("random");

      let result = getRandomPlayerPokemon(true, false, true);
      expect(result.species.speciesId).toBe(SpeciesId.ARCEUS);

      game.override.seed("random2");

      result = getRandomPlayerPokemon(true, false, true);
      expect(result.species.speciesId).toBe(SpeciesId.ARCEUS);
    });
  });

  describe("getHighestLevelPlayerPokemon", () => {
    it("gets highest level pokemon", () => {
      const party = scene.getPlayerParty();
      party[0].level = 100;

      const result = getHighestLevelPlayerPokemon();
      expect(result.species.speciesId).toBe(SpeciesId.ARCEUS);
    });

    it("gets highest level pokemon at different index", () => {
      const party = scene.getPlayerParty();
      party[1].level = 100;

      const result = getHighestLevelPlayerPokemon();
      expect(result.species.speciesId).toBe(SpeciesId.MANAPHY);
    });

    it("breaks ties by getting returning lower index", () => {
      const party = scene.getPlayerParty();
      party[0].level = 100;
      party[1].level = 100;

      const result = getHighestLevelPlayerPokemon();
      expect(result.species.speciesId).toBe(SpeciesId.ARCEUS);
    });

    it("returns highest level unfainted if unfainted is true", async () => {
      const party = scene.getPlayerParty();
      party[0].level = 100;
      party[0].faint();
      await party[0].updateInfo();
      party[1].level = 10;

      const result = getHighestLevelPlayerPokemon(true);
      expect(result.species.speciesId).toBe(SpeciesId.MANAPHY);
    });
  });

  describe("getLowestLevelPokemon", () => {
    it("gets lowest level pokemon", () => {
      const party = scene.getPlayerParty();
      party[0].level = 100;

      const result = getLowestLevelPlayerPokemon();
      expect(result.species.speciesId).toBe(SpeciesId.MANAPHY);
    });

    it("gets lowest level pokemon at different index", () => {
      const party = scene.getPlayerParty();
      party[1].level = 100;

      const result = getLowestLevelPlayerPokemon();
      expect(result.species.speciesId).toBe(SpeciesId.ARCEUS);
    });

    it("breaks ties by getting returning lower index", () => {
      const party = scene.getPlayerParty();
      party[0].level = 100;
      party[1].level = 100;

      const result = getLowestLevelPlayerPokemon();
      expect(result.species.speciesId).toBe(SpeciesId.ARCEUS);
    });

    it("returns lowest level unfainted if unfainted is true", async () => {
      const party = scene.getPlayerParty();
      party[0].level = 10;
      party[0].faint();
      await party[0].updateInfo();
      party[1].level = 100;

      const result = getLowestLevelPlayerPokemon(true);
      expect(result.species.speciesId).toBe(SpeciesId.MANAPHY);
    });
  });

  describe("getRandomSpeciesByStarterCost", () => {
    it("gets species for a starter tier", () => {
      const result = getRandomSpeciesByStarterCost(5);
      const pokeSpecies = getPokemonSpecies(result);

      expect(pokeSpecies.speciesId).toBe(result);
      expect(speciesStarterCosts[result]).toBe(5);
    });

    it("gets species for a starter tier range", () => {
      const result = getRandomSpeciesByStarterCost([5, 8]);
      const pokeSpecies = getPokemonSpecies(result);

      expect(pokeSpecies.speciesId).toBe(result);
      expect(speciesStarterCosts[result]).toBeGreaterThanOrEqual(5);
      expect(speciesStarterCosts[result]).toBeLessThanOrEqual(8);
    });

    it("excludes species from search", () => {
      // Only 9 tiers are: Koraidon, Miraidon, Arceus, Rayquaza, Kyogre, Groudon, Zacian
      const result = getRandomSpeciesByStarterCost(9, [
        SpeciesId.KORAIDON,
        SpeciesId.MIRAIDON,
        SpeciesId.ARCEUS,
        SpeciesId.RAYQUAZA,
        SpeciesId.KYOGRE,
        SpeciesId.GROUDON,
      ]);
      const pokeSpecies = getPokemonSpecies(result);
      expect(pokeSpecies.speciesId).toBe(SpeciesId.ZACIAN);
    });

    it("gets species of specified types", () => {
      // Only 9 tiers are: Koraidon, Miraidon, Arceus, Rayquaza, Kyogre, Groudon, Zacian
      const result = getRandomSpeciesByStarterCost(9, undefined, [ElementalType.GROUND]);
      const pokeSpecies = getPokemonSpecies(result);
      expect(pokeSpecies.speciesId).toBe(SpeciesId.GROUDON);
    });
  });

  describe("koPlayerPokemon", () => {
    it("KOs a pokemon", () => {
      const party = scene.getPlayerParty();
      const arceus = party[0];
      arceus.hp = 100;
      expect(arceus.isAllowedInBattle()).toBe(true);

      koPlayerPokemon(arceus);
      expect(arceus.isAllowedInBattle()).toBe(false);
    });
  });

  describe("getTextWithEncounterDialogueTokens", () => {
    it("injects dialogue tokens and color styling", () => {
      scene.currentBattle.mysteryEncounter = new MysteryEncounter(null);
      scene.currentBattle.mysteryEncounter.setDialogueToken("test", "value");

      const result = getEncounterText("mysteryEncounter:unit_test_dialogue");
      expect(result).toEqual("mysteryEncounter:unit_test_dialogue");
    });

    it("can perform nested dialogue token injection", () => {
      scene.currentBattle.mysteryEncounter = new MysteryEncounter(null);
      scene.currentBattle.mysteryEncounter.setDialogueToken("test", "value");
      scene.currentBattle.mysteryEncounter.setDialogueToken("testvalue", "new");

      const result = getEncounterText("mysteryEncounter:unit_test_dialogue");
      expect(result).toEqual("mysteryEncounter:unit_test_dialogue");
    });
  });

  describe("queueEncounterMessage", () => {
    it("queues a message with encounter dialogue tokens", async () => {
      scene.currentBattle.mysteryEncounter = new MysteryEncounter(null);
      scene.currentBattle.mysteryEncounter.setDialogueToken("test", "value");
      const phaseSpy = vi.spyOn(game.scene.phaseManager, "createAndUnshiftPhase");

      queueEncounterMessage("mysteryEncounter:unit_test_dialogue");
      const expectedParams = ["mysteryEncounter:unit_test_dialogue", undefined, true];
      expect(phaseSpy).toHaveBeenCalledWith("MessagePhase", ...expectedParams);
    });
  });

  describe("showEncounterText", () => {
    it("showText with dialogue tokens", async () => {
      scene.currentBattle.mysteryEncounter = new MysteryEncounter(null);
      scene.currentBattle.mysteryEncounter.setDialogueToken("test", "value");
      const spy = vi.spyOn(game.scene.ui, "showText");

      await showEncounterText("mysteryEncounter:unit_test_dialogue");
      expect(spy).toHaveBeenCalledWith("mysteryEncounter:unit_test_dialogue", {
        callback: expect.any(Function),
        callbackDelay: 0,
        prompt: true,
      });
    });
  });

  describe("showEncounterDialogue", () => {
    it("showText with dialogue tokens", async () => {
      scene.currentBattle.mysteryEncounter = new MysteryEncounter(null);
      scene.currentBattle.mysteryEncounter.setDialogueToken("test", "value");
      const spy = vi.spyOn(game.scene.ui, "showDialogue");

      await showEncounterDialogue("mysteryEncounter:unit_test_dialogue", "mysteryEncounter:unit_test_dialogue");
      expect(spy).toHaveBeenCalledWith(
        "mysteryEncounter:unit_test_dialogue",
        "mysteryEncounter:unit_test_dialogue",
        expect.any(Function),
        undefined,
        0,
      );
    });
  });
});
