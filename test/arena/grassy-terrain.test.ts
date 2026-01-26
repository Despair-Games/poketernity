import { allMoves } from "#data/data-lists";
import { AbilityId } from "#enums/ability-id";
import { Challenges } from "#enums/challenges";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { TerrainType } from "#enums/terrain-type";
import { GameManager } from "#test/test-utils/game-manager";
import { toDmgValue } from "#utils/common-utils";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Arena - Grassy Terrain", () => {
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
      .battleType("single")
      .disableCrits()
      .enemyLevel(100)
      .startingLevel(100)
      .enemySpecies(SpeciesId.SHUCKLE)
      .enemyAbility(AbilityId.STURDY)
      .enemyMoveset(MoveId.SPLASH)
      .ability(AbilityId.NO_GUARD);
  });

  it("should halve the damage of Earthquake", async () => {
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const enemy = game.field.getEnemyPokemon();

    const eq = allMoves.get(MoveId.EARTHQUAKE);
    vi.spyOn(eq, "calculateBattlePower");

    game.move.use(MoveId.EARTHQUAKE);
    await game.toNextTurn();

    expect(eq.calculateBattlePower).toHaveLastReturnedWith(100);
    enemy.hp = enemy.getMaxHp();

    game.move.use(MoveId.GRASSY_TERRAIN);
    await game.toNextTurn();

    game.move.use(MoveId.EARTHQUAKE);
    await game.toEndOfTurn();

    expect(eq.calculateBattlePower).toHaveLastReturnedWith(50);
  });

  it("should not halve the damage of Earthquake if opponent is not grounded", async () => {
    game.override.enemySpecies(SpeciesId.PIDGEY);
    game.challengeMode.addChallenge(Challenges.INVERSE_BATTLE, 1, 1); // So that Earthquake actually has an effect
    await game.challengeMode.startBattle(SpeciesId.FEEBAS);

    const eq = allMoves.get(MoveId.EARTHQUAKE);
    vi.spyOn(eq, "calculateBattlePower");

    game.move.use(MoveId.GRASSY_TERRAIN);
    await game.toNextTurn();

    game.move.use(MoveId.EARTHQUAKE);
    await game.toEndOfTurn();

    expect(eq.calculateBattlePower).toHaveLastReturnedWith(100);
    expect(game.field.getEnemyPokemon()).not.toHaveFullHp();
  });

  it("should heal grounded Pokemon for each turn, including the turn when terrain expires", async () => {
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const pokemon = game.field.getPlayerPokemon();
    pokemon.hp = 1;

    // Should heal for 5 turns, including the turn when terrain expires
    game.move.use(MoveId.GRASSY_TERRAIN);
    await game.toNextTurn();
    expect(pokemon).toHaveHp(1 + toDmgValue(pokemon.getMaxHp() / 16));
    for (let i = 2; i < 6; i++) {
      game.move.use(MoveId.SPLASH);
      await game.toNextTurn();
      expect(pokemon).toHaveHp(1 + i * toDmgValue(pokemon.getMaxHp() / 16));
    }

    expect(game).toHaveTerrain(TerrainType.NONE);
  });

  it("should not heal ungrounded Pokemon", async () => {
    await game.classicMode.startBattle(SpeciesId.MASQUERAIN);

    const pokemon = game.field.getPlayerPokemon();
    pokemon.hp = 1;
    game.move.use(MoveId.GRASSY_TERRAIN);
    await game.toNextTurn();

    expect(game).toHaveTerrain(TerrainType.GRASSY);
    expect(pokemon).toHaveHp(1);
  });

  it("should increase the power of Grass-type moves by 1.3x", async () => {
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const enemy = game.field.getEnemyPokemon();

    const moveSpy = vi.spyOn(allMoves.get(MoveId.ENERGY_BALL), "calculateBattlePower");

    game.move.use(MoveId.ENERGY_BALL);
    await game.toNextTurn();

    expect(moveSpy).toHaveReturnedWith(90);
    enemy.hp = enemy.getMaxHp();

    game.move.use(MoveId.GRASSY_TERRAIN);
    await game.toNextTurn();

    game.move.use(MoveId.ENERGY_BALL);
    await game.toEndOfTurn();

    expect(moveSpy).toHaveReturnedWith(90 * 1.3);
  });
});
