import { RIVAL_SLOT_0_POKEMON, RIVAL_SLOT_1_POKEMON } from "#constants/trainer-constants";
import { SpeciesId } from "#enums/species-id";
import { TrainerGender } from "#enums/trainer-gender";
import { TrainerSlot } from "#enums/trainer-slot";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import { GameManager } from "#test/test-utils/game-manager";
import { newRivalTrainerConfigs } from "#trainers/trainer-configs/rival-trainer-configs";
import { TrainerData } from "#trainers/trainer-data";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Trainers - Rival", async () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;
  let rivalData: EnemyPokemon[][];

  beforeAll(() => {
    phaserGame = new Phaser.Game({
      type: Phaser.HEADLESS,
    });
  });

  beforeEach(async () => {
    game = new GameManager(phaserGame);

    game.override.battleType("single");

    await game.classicMode.runToSummon(SpeciesId.MAGIKARP);

    rivalData = getRivalParties();
  });

  afterEach(() => {
    game.phaseInterceptor.restoreOg();
  });

  // TODO: does this actually test anything with `BattleScene.randBattleSeedInt` mocked out?
  it("should generate the same Pokemon across all configs", () => {
    for (let i = 0; i < rivalData.length - 1; i++) {
      const partyA = rivalData[i].map((p) => p.species.speciesId);
      const partyB = rivalData[i + 1].slice(0, partyA.length).map((p) => p.species.speciesId);

      partyA.forEach((p, j) => expect(p).toBe(partyB[j]));
    }
  });

  it("should lead with a random First Partner Pokemon across all configs", () => {
    rivalData.forEach((party) => expect(party[0]).toBeOfSpecies([...RIVAL_SLOT_0_POKEMON]));
  });

  it("should have a random Route 1 Bird Pokemon across all configs", () => {
    rivalData.forEach((party) => expect(party[1]).toBeOfSpecies([...RIVAL_SLOT_1_POKEMON]));
  });
});

function getRivalParties(): EnemyPokemon[][] {
  return Object.values(newRivalTrainerConfigs).map(
    (cfg) => new TrainerData(TrainerSlot.TRAINER, cfg, TrainerGender.MALE).party,
  );
}
