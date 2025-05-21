import { DEFAULT_STARTER_IVS } from "#constants/game-constants";
import { defaultStarterSpecies } from "#data/default-starters";
import { AbilityAttr, DexAttr } from "#data/dex-attributes";
import { Nature } from "#enums/nature";
import type { GameData } from "#system/game-data";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

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
    const defaultIVs = new Array(6).fill(DEFAULT_STARTER_IVS);

    const caughtCount = gameData.getSpeciesCount((dexEntry) => dexEntry.caughtAttr > 0);
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
      expect(starterData.abilityAttr & AbilityAttr.PASSIVE).toBeFalsy();
      expect(starterData.ivs).toEqual(defaultIVs);
      expect(starterData.valueReduction).toBe(0);
      expect(starterData.classicWinCount).toBe(0);

      // Starters get all neutral natures unlocked
      const unlockedNatures = gameData.getNaturesForAttr(starterData.natureAttr);
      expect(unlockedNatures).toEqual(neutralNatures);

      expect(dexData.seenCount).toBe(0);
      expect(dexData.caughtCount).toBe(0);
      expect(dexData.hatchedCount).toBe(0);

      [dexData.caughtAttr, dexData.seenAttr].forEach((attr: bigint) => {
        expect(attr !== 0n).toBeTruthy();
        expect(attr & DexAttr.NON_SHINY).toBeTruthy();
        expect(attr & DexAttr.FEMALE).toBeTruthy();
        expect(attr & DexAttr.MALE).toBeTruthy();
        expect(attr & DexAttr.SHINY_BASE_VARIANT).toBeFalsy();
        expect(attr & DexAttr.SHINY_RARE_VARIANT).toBeFalsy();
        expect(attr & DexAttr.SHINY_EPIC_VARIANT).toBeFalsy();
        expect(attr & DexAttr.DEFAULT_FORM).toBeTruthy();
        expect(gameData.getFormIndex(attr)).toBe(0);
      });
    }
  });
});
