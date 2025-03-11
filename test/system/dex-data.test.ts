import { defaultStarterSpecies } from "#app/data/balance/default-starters";
import { AbilityAttr, DexAttr } from "#app/data/dex-attributes";
import type { GameData } from "#app/system/game-data";
import { Nature } from "#enums/nature";
import { GameManager } from "#test/test-utils/gameManager";
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

      expect(starterData.eggMoves).toBe(0);
      expect(starterData.candyCount).toBe(0);
      expect(starterData.candyProgress).toBe(0);
      expect(starterData.abilityAttr & AbilityAttr.ABILITY_1).toBeTruthy();
      expect(starterData.abilityAttr & AbilityAttr.ABILITY_2).toBeFalsy();
      expect(starterData.abilityAttr & AbilityAttr.ABILITY_HIDDEN).toBeFalsy();
      expect(starterData.passiveAttr).toBe(0);
      expect(starterData.valueReduction).toBe(0);
      expect(starterData.classicWinCount).toBe(0);

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
});
