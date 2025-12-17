import { GYM_LEADER_STRENGTH_TEMPLATES } from "#constants/trainer-constants";
import { signatureSpecies } from "#data/signature-species";
import { TrainerData } from "#data/trainer-data";
import { ElementalType } from "#enums/elemental-type";
import { SpeciesId } from "#enums/species-id";
import { TrainerSlot } from "#enums/trainer-slot";
import { TrainerType } from "#enums/trainer-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import { GameManager } from "#test/test-utils/game-manager";
import { newGymLeaderTrainerConfigs } from "#trainer-configs/gym-leader-configs";
import { coerceArray } from "#utils/common-utils";
import { getPokemonSpecies } from "#utils/pokemon-utils";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Trainers - Gym Leaders", async () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

  beforeAll(() => {
    phaserGame = new Phaser.Game({
      type: Phaser.HEADLESS,
    });
  });

  beforeEach(() => {
    game = new GameManager(phaserGame);
    game.override.battleType("single");
  });

  afterEach(() => {
    game.phaseInterceptor.restoreOg();
  });

  type GymLeaderTestCase = {
    name: keyof typeof signatureSpecies;
    specialtyType: keyof typeof ElementalType;
  };

  const testGymLeaders: GymLeaderTestCase[] = [
    { name: "BROCK", specialtyType: "ROCK" },
    { name: "MISTY", specialtyType: "WATER" },
    { name: "LT_SURGE", specialtyType: "ELECTRIC" },
    { name: "ERIKA", specialtyType: "GRASS" },
    { name: "JANINE", specialtyType: "POISON" },
    { name: "SABRINA", specialtyType: "PSYCHIC" },
    { name: "BLAINE", specialtyType: "FIRE" },
    { name: "GIOVANNI", specialtyType: "GROUND" },
  ];

  type WaveTestCase = {
    wave: number;
    expectedPartySize: number;
  };

  const testWaves = [1, 20, 25, 40, 60, 79, 80, 100, 120, 140, 145, 160, 180];
  const waveTestCases: WaveTestCase[] = testWaves.map((wave) => {
    const expectedPartySize = GYM_LEADER_STRENGTH_TEMPLATES[Math.min(Math.ceil(wave / 20), 8) - 1].length;
    return { wave, expectedPartySize };
  });

  describe.each(testGymLeaders)("$name", ({ name, specialtyType }) => {
    const sigSpecies = signatureSpecies[name];
    describe.each(waveTestCases)("Wave $wave", ({ wave, expectedPartySize }) => {
      let party: EnemyPokemon[];

      beforeEach(async () => {
        game.override.startingWave(wave);

        await game.classicMode.runToSummon(SpeciesId.MAGIKARP);

        const config = newGymLeaderTrainerConfigs[TrainerType[name]]!;
        party = new TrainerData(TrainerSlot.TRAINER, config).party;
      });

      it(`should have ${expectedPartySize} party Pokemon`, () => {
        expect(party).toHaveLength(expectedPartySize);
      });

      it("should not have any duplicate species of Pokemon", () => {
        const partySpecies = party.map((p) => p.species.speciesId);
        expect(partySpecies).toEqual([...new Set(partySpecies)]);
      });

      it("should have their first signature species in their last party slot", () => {
        const lastPokemonRelatedSpecies = party.at(-1)?.species.getRelatedSpecies();
        expect(lastPokemonRelatedSpecies).toBeDefined();

        const firstSignatureSpecies = coerceArray(sigSpecies[0]);
        expect([...lastPokemonRelatedSpecies!].some((s) => firstSignatureSpecies.includes(s))).toBeTruthy();
      });

      const numRandomPokemon = expectedPartySize - sigSpecies.length;
      if (numRandomPokemon > 0) {
        it(`should lead with ${numRandomPokemon} randomly generated ${specialtyType}-type Pokemon`, () => {
          const randomPokemon = party.slice(0, numRandomPokemon);
          for (const pokemon of randomPokemon) {
            const firstStageSpecies = getPokemonSpecies(pokemon.species.getFirstStageSpecies());
            expect(firstStageSpecies.isOfType(ElementalType[specialtyType])).toBe(true);
            expect(firstStageSpecies.speciesId).not.toBeOneOf(sigSpecies.flat());
          }

          const nonRandomPokemonRelatedSpecies = party[numRandomPokemon].species.getRelatedSpecies();
          expect(
            [...nonRandomPokemonRelatedSpecies].some((s) => coerceArray(sigSpecies.at(-1)!).includes(s)),
          ).toBeTruthy();
        });
      }
    });
  });
});
