import { allMoves } from "#app/data/data-lists";
import { toDmgValue } from "#app/utils";
import { AbilityId } from "#enums/ability-id";
import { Challenges } from "#enums/challenges";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { TerrainType } from "#enums/terrain-type";
import { GameManager } from "#test/test-utils/gameManager";
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
      .enemyLevel(1)
      .enemySpecies(SpeciesId.SHUCKLE)
      .enemyAbility(AbilityId.STURDY)
      .enemyMoveset(MoveId.SPLASH)
      .moveset([MoveId.GRASSY_TERRAIN, MoveId.EARTHQUAKE])
      .ability(AbilityId.NO_GUARD);
  });

  it("should halve the damage of Earthquake", async () => {
    await game.classicMode.startBattle([SpeciesId.TAUROS]);

    const eq = allMoves.get(MoveId.EARTHQUAKE);
    vi.spyOn(eq, "calculateBattlePower");

    game.move.select(MoveId.EARTHQUAKE);
    await game.toNextTurn();

    expect(eq.calculateBattlePower).toHaveLastReturnedWith(100);

    game.move.select(MoveId.GRASSY_TERRAIN);
    await game.toNextTurn();

    game.move.select(MoveId.EARTHQUAKE);
    await game.toEndOfTurn();

    expect(eq.calculateBattlePower).toHaveLastReturnedWith(50);
  });

  it("should not halve the damage of Earthquake if opponent is not grounded", async () => {
    game.override.enemySpecies(SpeciesId.PIDGEY);
    game.challengeMode.addChallenge(Challenges.INVERSE_BATTLE, 1, 1); // So that Earthquake actually has an effect
    await game.challengeMode.startBattle([SpeciesId.FEEBAS]);

    const eq = allMoves.get(MoveId.EARTHQUAKE);
    vi.spyOn(eq, "calculateBattlePower");

    game.move.select(MoveId.GRASSY_TERRAIN);
    await game.toNextTurn();

    game.move.select(MoveId.EARTHQUAKE);
    await game.toEndOfTurn();

    expect(eq.calculateBattlePower).toHaveLastReturnedWith(100);
  });

  it("should heal grounded Pokemon for each turn, including the turn when terrain expires", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    const pokemon = game.field.getPlayerPokemon();
    pokemon.hp = 1;

    // Should heal for 5 turns, including the turn when terrain expires
    game.move.use(MoveId.GRASSY_TERRAIN);
    await game.toNextTurn();
    game.move.use(MoveId.SPLASH);
    await game.toNextTurn();
    game.move.use(MoveId.SPLASH);
    await game.toNextTurn();
    game.move.use(MoveId.SPLASH);
    await game.toNextTurn();
    game.move.use(MoveId.SPLASH);
    await game.toNextTurn();

    expect(game.scene.arena.terrain).toBeFalsy();
    expect(pokemon.hp).toBe(1 + 5 * toDmgValue(pokemon.getMaxHp() / 16));
  });

  it("should not heal ungrounded Pokemon", async () => {
    await game.classicMode.startBattle([SpeciesId.MASQUERAIN]);

    const pokemon = game.field.getPlayerPokemon();
    pokemon.hp = 1;
    game.move.use(MoveId.GRASSY_TERRAIN);
    await game.toNextTurn();

    expect(game.scene.arena.hasTerrain(TerrainType.GRASSY)).toBe(true);
    expect(pokemon.hp).toBe(1);
  });
});
