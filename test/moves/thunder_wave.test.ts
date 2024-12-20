import type { EnemyPokemon } from "#app/field/pokemon";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { StatusEffect } from "#enums/status-effect";
import { GameManager } from "#test/testUtils/gameManager";
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
      .starterSpecies(Species.PIKACHU)
      .moveset([Moves.THUNDER_WAVE])
      .enemyMoveset(Moves.SPLASH);
  });

  // References: https://bulbapedia.bulbagarden.net/wiki/Thunder_Wave_(move)

  it("paralyzes non-statused Pokemon that are not Ground types", async () => {
    game.override.enemySpecies(Species.MAGIKARP);
    await game.startBattle();

    const enemyPokemon: EnemyPokemon = game.scene.getEnemyPokemon()!;

    game.move.select(Moves.THUNDER_WAVE);
    await game.move.forceHit();
    await game.phaseInterceptor.to("BerryPhase", false);

    expect(enemyPokemon.status?.effect).toBe(StatusEffect.PARALYSIS);
  });

  it("does not paralyze if the Pokemon is a Ground-type", async () => {
    game.override.enemySpecies(Species.DIGLETT);
    await game.startBattle();

    const enemyPokemon: EnemyPokemon = game.scene.getEnemyPokemon()!;

    game.move.select(Moves.THUNDER_WAVE);
    await game.move.forceHit();
    await game.phaseInterceptor.to("BerryPhase", false);

    expect(enemyPokemon.status).toBeUndefined();
  });

  it("does not paralyze if the Pokemon already has a status effect", async () => {
    game.override.enemySpecies(Species.MAGIKARP).enemyStatusEffect(StatusEffect.BURN);
    await game.startBattle();

    const enemyPokemon: EnemyPokemon = game.scene.getEnemyPokemon()!;

    game.move.select(Moves.THUNDER_WAVE);
    await game.move.forceHit();
    await game.phaseInterceptor.to("BerryPhase", false);

    expect(enemyPokemon.status?.effect).not.toBe(StatusEffect.PARALYSIS);
  });

  it("affects Ground types if the user has Normalize", async () => {
    game.override.ability(Abilities.NORMALIZE).enemySpecies(Species.DIGLETT);
    await game.startBattle();

    const enemyPokemon: EnemyPokemon = game.scene.getEnemyPokemon()!;

    game.move.select(Moves.THUNDER_WAVE);
    await game.move.forceHit();
    await game.phaseInterceptor.to("BerryPhase", false);

    expect(enemyPokemon.status?.effect).toBe(StatusEffect.PARALYSIS);
  });

  it("does not affect Ghost types if the user has Normalize", async () => {
    game.override.ability(Abilities.NORMALIZE).enemySpecies(Species.HAUNTER);
    await game.startBattle();

    const enemyPokemon: EnemyPokemon = game.scene.getEnemyPokemon()!;

    game.move.select(Moves.THUNDER_WAVE);
    await game.move.forceHit();
    await game.phaseInterceptor.to("BerryPhase", false);

    expect(enemyPokemon.status).toBeUndefined();
  });
});