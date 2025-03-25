import type { EnemyPokemon } from "#app/field/pokemon";
import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { StatusEffect } from "#enums/status-effect";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Thunder Wave", () => {
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
      .starterSpecies(SpeciesId.PIKACHU)
      .moveset([MoveId.THUNDER_WAVE])
      .enemyMoveset(MoveId.SPLASH);
  });

  // References: https://bulbapedia.bulbagarden.net/wiki/Thunder_Wave_(move)

  it("paralyzes non-statused Pokemon that are not Ground types", async () => {
    game.override.enemySpecies(SpeciesId.MAGIKARP);
    await game.startBattle();

    const enemyPokemon: EnemyPokemon = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.THUNDER_WAVE);
    await game.move.forceHit();
    await game.toEndOfTurn();

    expect(enemyPokemon.getStatusEffect(true)).toBe(StatusEffect.PARALYSIS);
  });

  it("does not paralyze if the Pokemon is a Ground-type", async () => {
    game.override.enemySpecies(SpeciesId.DIGLETT);
    await game.startBattle();

    const enemyPokemon: EnemyPokemon = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.THUNDER_WAVE);
    await game.move.forceHit();
    await game.toEndOfTurn();

    expect(enemyPokemon.getStatusEffect(true)).toBe(StatusEffect.NONE);
  });

  it("does not paralyze if the Pokemon already has a status effect", async () => {
    game.override.enemySpecies(SpeciesId.MAGIKARP).enemyStatusEffect(StatusEffect.BURN);
    await game.startBattle();

    const enemyPokemon: EnemyPokemon = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.THUNDER_WAVE);
    await game.move.forceHit();
    await game.toEndOfTurn();

    expect(enemyPokemon.getStatusEffect(true)).not.toBe(StatusEffect.PARALYSIS);
  });

  it("affects Ground types if the user has Normalize", async () => {
    game.override.ability(AbilityId.NORMALIZE).enemySpecies(SpeciesId.DIGLETT);
    await game.startBattle();

    const enemyPokemon: EnemyPokemon = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.THUNDER_WAVE);
    await game.move.forceHit();
    await game.toEndOfTurn();

    expect(enemyPokemon.getStatusEffect(true)).toBe(StatusEffect.PARALYSIS);
  });

  it("does not affect Ghost types if the user has Normalize", async () => {
    game.override.ability(AbilityId.NORMALIZE).enemySpecies(SpeciesId.HAUNTER);
    await game.startBattle();

    const enemyPokemon: EnemyPokemon = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.THUNDER_WAVE);
    await game.move.forceHit();
    await game.toEndOfTurn();

    expect(enemyPokemon.getStatusEffect(true)).toBe(StatusEffect.NONE);
  });
});
