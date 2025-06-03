import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { Move } from "#moves/move";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Move - Heavy Slam", () => {
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
    game.override
      .ability(AbilityId.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.FLAPPLE)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .startingLevel(5)
      .enemyLevel(100);
  });

  it.each([
    { power: 40, species: [SpeciesId.GASTLY, SpeciesId.FLAPPLE, SpeciesId.CHATOT], weights: [0.1, 1.0, 1.9] },
    { power: 60, species: [SpeciesId.PICHU, SpeciesId.PIDOVE, SpeciesId.CATERPIE], weights: [2.0, 2.1, 2.9] },
    { power: 80, species: [SpeciesId.CLEFFA, SpeciesId.PHIONE, SpeciesId.GLAMEOW], weights: [3.0, 3.1, 3.9] },
    { power: 100, species: [SpeciesId.SEEDOT, SpeciesId.SPRIGATITO, SpeciesId.CHI_YU], weights: [4.0, 4.1, 4.9] },
    { power: 120, species: [SpeciesId.CORSOLA, SpeciesId.HATTERENE, SpeciesId.VULPIX], weights: [5.0, 5.1, 9.9] },
  ])("should scale with weight differences (power $power)", async ({ power, species, weights }) => {
    await game.classicMode.startBattle(species[0], species[1], species[2]);
    const moveSpy = vi.spyOn(Move.prototype, "calculateBattlePower");

    game.move.use(MoveId.HEAVY_SLAM);
    await game.toNextTurn();
    expect(game.field.getPlayerPokemon().getWeight()).toBe(weights[0]);
    expect(game.field.getEnemyPokemon().getWeight()).toBe(1);
    expect(moveSpy).toHaveLastReturnedWith(power);

    game.switchPokemon(1);
    await game.toNextTurn();

    game.move.use(MoveId.HEAVY_SLAM);
    await game.toNextTurn();
    expect(game.field.getPlayerPokemon().getWeight()).toBe(weights[1]);
    expect(moveSpy).toHaveLastReturnedWith(power);

    game.switchPokemon(2);
    await game.toNextTurn();

    game.move.use(MoveId.HEAVY_SLAM);
    await game.toNextTurn();
    expect(game.field.getPlayerPokemon().getWeight()).toBe(weights[2]);
    expect(moveSpy).toHaveLastReturnedWith(power);
  });
});
