import { pokemonEvolutions } from "#app/data/balance/pokemon-evolutions";
import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import * as Utils from "#app/utils";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { Gender } from "#enums/gender";
import { getPokemonSpecies } from "#app/utils/pokemon-species-utils";
import { BiomePoolTier } from "#enums/biome-pool-tier";

describe("Evolution", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

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

    game.override.battleType("single");

    game.override.enemySpecies(Species.MAGIKARP);
    game.override.enemyAbility(Abilities.BALL_FETCH);

    game.override.startingLevel(60);
  });

  it("should keep hidden ability after evolving", async () => {
    await game.classicMode.runToSummon([Species.EEVEE, Species.TRAPINCH]);

    const eevee = game.scene.getPlayerParty()[0];
    const trapinch = game.scene.getPlayerParty()[1];
    eevee.abilityIndex = 2;
    trapinch.abilityIndex = 2;

    await eevee.evolve(pokemonEvolutions[Species.EEVEE][6]);
    expect(eevee.abilityIndex).toBe(2);

    await trapinch.evolve(pokemonEvolutions[Species.TRAPINCH][0]);
    expect(trapinch.abilityIndex).toBe(0); // doesn't have an HA -> defaults to 1st ability
  });

  it("should keep same ability slot after evolving", async () => {
    await game.classicMode.runToSummon([Species.BULBASAUR, Species.CHARMANDER]);

    const bulbasaur = game.scene.getPlayerParty()[0];
    const charmander = game.scene.getPlayerParty()[1];
    bulbasaur.abilityIndex = 0;
    charmander.abilityIndex = 1;

    await bulbasaur.evolve(pokemonEvolutions[Species.BULBASAUR][0]);
    expect(bulbasaur.abilityIndex).toBe(0);

    await charmander.evolve(pokemonEvolutions[Species.CHARMANDER][0]);
    expect(charmander.abilityIndex).toBe(1);
  });

  it("should handle illegal abilityIndex values", async () => {
    await game.classicMode.runToSummon([Species.SQUIRTLE]);

    const squirtle = game.scene.getPlayerPokemon()!;
    squirtle.abilityIndex = 5;

    await squirtle.evolve(pokemonEvolutions[Species.SQUIRTLE][0]);
    expect(squirtle.abilityIndex).toBe(0);
  });

  it("should handle nincada's unique evolution", async () => {
    await game.classicMode.runToSummon([Species.NINCADA]);

    const nincada = game.scene.getPlayerPokemon()!;
    nincada.abilityIndex = 2;
    nincada.metBiome = -1;
    nincada.gender = Gender.FEMALE;

    await nincada.evolve(pokemonEvolutions[Species.NINCADA][0]);
    const ninjask = game.scene.getPlayerParty()[0];
    const shedinja = game.scene.getPlayerParty()[1];
    expect(ninjask.abilityIndex).toBe(2);
    expect(shedinja.abilityIndex).toBe(0); // doesn't have an HA -> defaults to 1st ability
    expect(ninjask.gender).toBe(Gender.FEMALE);
    expect(shedinja.gender).toBe(Gender.GENDERLESS);
    // Regression test
    expect(shedinja.metBiome).toBe(-1);
  });

  it("should increase both HP and max HP when evolving", async () => {
    game.override
      .moveset([MoveId.SURF])
      .enemySpecies(Species.GOLEM)
      .enemyMoveset(MoveId.SPLASH)
      .startingWave(21)
      .startingLevel(16)
      .enemyLevel(50);

    await game.startBattle([Species.TOTODILE]);

    const totodile = game.scene.getPlayerPokemon()!;
    const hpBefore = totodile.hp;

    expect(totodile.hp).toBe(totodile.getMaxHp());

    const golem = game.scene.getEnemyPokemon()!;
    golem.hp = 1;

    expect(golem.hp).toBe(1);

    game.move.select(MoveId.SURF);
    await game.phaseInterceptor.to("EndEvolutionPhase");

    expect(totodile.hp).toBe(totodile.getMaxHp());
    expect(totodile.hp).toBeGreaterThan(hpBefore);
  });

  it("should not fully heal HP when evolving", async () => {
    game.override
      .moveset([MoveId.SURF])
      .enemySpecies(Species.GOLEM)
      .enemyMoveset(MoveId.SPLASH)
      .startingWave(21)
      .startingLevel(13)
      .enemyLevel(30);

    await game.startBattle([Species.CYNDAQUIL]);

    const cyndaquil = game.scene.getPlayerPokemon()!;
    cyndaquil.hp = Math.floor(cyndaquil.getMaxHp() / 2);
    const hpBefore = cyndaquil.hp;
    const maxHpBefore = cyndaquil.getMaxHp();

    expect(cyndaquil.hp).toBe(Math.floor(cyndaquil.getMaxHp() / 2));

    const golem = game.scene.getEnemyPokemon()!;
    golem.hp = 1;

    expect(golem.hp).toBe(1);

    game.move.select(MoveId.SURF);
    await game.phaseInterceptor.to("EndEvolutionPhase");

    expect(cyndaquil.getMaxHp()).toBeGreaterThan(maxHpBefore);
    expect(cyndaquil.hp).toBeGreaterThan(hpBefore);
    expect(cyndaquil.hp).toBeLessThan(cyndaquil.getMaxHp());
  });

  it("should handle rng-based split evolution", async () => {
    /* this test checks to make sure that tandemaus will
     * evolve into a 3 family maushold 25% of the time
     * and a 4 family maushold the other 75% of the time
     * This is done by using the getEvolution method in pokemon.ts
     * getEvolution will give back the form that the pokemon can evolve into
     * It does this by checking the pokemon conditions in pokemon-forms.ts
     * For tandemaus, the conditions are random due to a randSeedInt(4)
     * If the value is 0, it's a 3 family maushold, whereas if the value is
     * 1, 2 or 3, it's a 4 family maushold
     */
    await game.startBattle([Species.TANDEMAUS]); // starts us off with a tandemaus
    const playerPokemon = game.scene.getPlayerPokemon()!;
    playerPokemon.level = 25; // tandemaus evolves at level 25
    vi.spyOn(Utils, "randSeedInt").mockReturnValue(0); // setting the random generator to be 0 to force a three family maushold
    const threeForm = playerPokemon.getEvolution()!;
    expect(threeForm.evoFormKey).toBe("three"); // as per pokemon-forms, the evoFormKey for 3 family mausholds is "three"
    for (let f = 1; f < 4; f++) {
      vi.spyOn(Utils, "randSeedInt").mockReturnValue(f); // setting the random generator to 1, 2 and 3 to force 4 family mausholds
      const fourForm = playerPokemon.getEvolution()!;
      expect(fourForm.evoFormKey).toBe(null); // meanwhile, according to the pokemon-forms, the evoFormKey for a 4 family maushold is null
    }
  });

  it("wild Pokemon with multiple possible evolutions should pick a random evolution", async () => {
    let rngSweepProgress = 0; // Will simulate full range of RNG rolls by steadily increasing from 0 to 1

    vi.spyOn(Phaser.Math.RND, "realInRange").mockImplementation((min: number, max: number) => {
      return rngSweepProgress * (max - min) + min;
    });

    const actualEvolutions = new Set<Species>();
    const trials = 8; // For all 8 Eeveelutions
    for (let i = 0; i < trials; i++) {
      rngSweepProgress = (2 * i + 1) / (2 * trials);
      actualEvolutions.add(getPokemonSpecies(Species.EEVEE).getEnemySpeciesForLevel(100));
    }
    expect(actualEvolutions.size).toBe(trials);
  });

  it("wild Pokemon should not already be evolved at level 1", async () => {
    for (const evoArray of Object.values(pokemonEvolutions)) {
      for (const evo of evoArray) {
        expect(evo.enemyEvolveLevel).toBeGreaterThan(1);
      }
    }
  });

  it("wild Pokemon should be pre-evolved if they are at a sufficiently low level", async () => {
    game.override.enemySpecies(0); // Disable the enemy species override
    await game.classicMode.startBattle([Species.FEEBAS]);

    game.move.use(MoveId.SPLASH);
    await game.doKillOpponents();

    // Mock the next wave's Pokemon pool
    vi.spyOn(game.scene.arena as any, "pokemonPool", "get").mockReturnValue({
      [BiomePoolTier.COMMON]: [Species.SLOWKING],
      [BiomePoolTier.UNCOMMON]: [],
      [BiomePoolTier.RARE]: [],
      [BiomePoolTier.SUPER_RARE]: [],
      [BiomePoolTier.ULTRA_RARE]: [],
    });

    await game.toNextWave();

    expect(game.field.getEnemyPokemon().species.speciesId).toBe(Species.SLOWPOKE);
  });
});
