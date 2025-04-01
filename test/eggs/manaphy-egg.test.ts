import { Egg } from "#app/data/egg";
import { EggSourceType } from "#enums/egg-source-types";
import { EggTier } from "#enums/egg-type";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
import { EVERYTHING_SAVE_FILE_PATH } from "#test/test-utils/testUtils";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Manaphy Eggs", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;
  const EGG_HATCH_COUNT: number = 48;

  beforeAll(() => {
    phaserGame = new Phaser.Game({
      type: Phaser.HEADLESS,
    });
    game = new GameManager(phaserGame);
  });

  afterEach(() => {
    game.phaseInterceptor.restoreOg();
  });

  beforeEach(async () => {
    await game.importData(EVERYTHING_SAVE_FILE_PATH);
  });

  it("should have correct Manaphy rates and Rare Egg Move rates, from the egg gacha", async () => {
    let manaphyCount = 0;
    let phioneCount = 0;
    let rareEggMoveCount = 0;

    await game.rng.equalSample(EGG_HATCH_COUNT, () => {
      const newEgg = new Egg({ tier: EggTier.COMMON, sourceType: EggSourceType.GACHA_SHINY, id: 204 });
      const newHatch = newEgg.generatePlayerPokemon();
      if (newHatch.species.speciesId === SpeciesId.MANAPHY) {
        manaphyCount++;
      } else if (newHatch.species.speciesId === SpeciesId.PHIONE) {
        phioneCount++;
      }
      if (newEgg.eggMoveIndex === 3) {
        rareEggMoveCount++;
      }
    });

    expect(manaphyCount + phioneCount).toBe(EGG_HATCH_COUNT);
    expect(manaphyCount).toBe((1 / 8) * EGG_HATCH_COUNT);
    expect(rareEggMoveCount).toBe((1 / 12) * EGG_HATCH_COUNT);
  });

  it("should have correct Manaphy rates and Rare Egg Move rates, from Phione species eggs", async () => {
    let manaphyCount = 0;
    let phioneCount = 0;
    let rareEggMoveCount = 0;

    await game.rng.equalSample(EGG_HATCH_COUNT, () => {
      const newEgg = new Egg({ speciesId: SpeciesId.PHIONE, sourceType: EggSourceType.SAME_SPECIES_EGG });
      const newHatch = newEgg.generatePlayerPokemon();
      if (newHatch.species.speciesId === SpeciesId.MANAPHY) {
        manaphyCount++;
      } else if (newHatch.species.speciesId === SpeciesId.PHIONE) {
        phioneCount++;
      }
      if (newEgg.eggMoveIndex === 3) {
        rareEggMoveCount++;
      }
    });

    expect(manaphyCount + phioneCount).toBe(EGG_HATCH_COUNT);
    expect(manaphyCount).toBe((1 / 8) * EGG_HATCH_COUNT);
    expect(rareEggMoveCount).toBe((1 / 6) * EGG_HATCH_COUNT);
  });

  it("should have correct Manaphy rates and Rare Egg Move rates, from Manaphy species eggs", async () => {
    let manaphyCount = 0;
    let phioneCount = 0;
    let rareEggMoveCount = 0;

    await game.rng.equalSample(EGG_HATCH_COUNT, () => {
      const newEgg = new Egg({ speciesId: SpeciesId.MANAPHY, sourceType: EggSourceType.SAME_SPECIES_EGG });
      const newHatch = newEgg.generatePlayerPokemon();
      if (newHatch.species.speciesId === SpeciesId.MANAPHY) {
        manaphyCount++;
      } else if (newHatch.species.speciesId === SpeciesId.PHIONE) {
        phioneCount++;
      }
      if (newEgg.eggMoveIndex === 3) {
        rareEggMoveCount++;
      }
    });

    expect(phioneCount).toBe(0);
    expect(manaphyCount).toBe(EGG_HATCH_COUNT);
    expect(rareEggMoveCount).toBe((1 / 6) * EGG_HATCH_COUNT);
  });
});
