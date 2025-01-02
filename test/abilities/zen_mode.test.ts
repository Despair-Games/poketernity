import { Status } from "#app/data/status-effect";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { StatusEffect } from "#enums/status-effect";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - ZEN MODE", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;
  const baseForm = 0;
  const zenForm = 1;

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
    game.overridesHelper
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyLevel(5)
      .ability(Abilities.ZEN_MODE)
      .moveset(Moves.SPLASH)
      .enemyMoveset(Moves.SEISMIC_TOSS);
  });

  it("shouldn't change form when taking damage if not dropping below 50% HP", async () => {
    await game.classicModeHelper.startBattle([Species.DARMANITAN]);
    const darmanitan = game.scene.getPlayerPokemon()!;
    expect(darmanitan.formIndex).toBe(baseForm);

    game.moveHelper.select(Moves.SPLASH);
    await game.toNextTurn();

    expect(darmanitan.getHpRatio()).toBeLessThan(1);
    expect(darmanitan.getHpRatio()).toBeGreaterThan(0.5);
    expect(darmanitan.formIndex).toBe(baseForm);
  });

  it("should change form when falling below 50% HP", async () => {
    await game.classicModeHelper.startBattle([Species.DARMANITAN]);

    const darmanitan = game.scene.getPlayerPokemon()!;
    darmanitan.hp = darmanitan.getMaxHp() / 2 + 1;
    expect(darmanitan.formIndex).toBe(baseForm);

    game.moveHelper.select(Moves.SPLASH);
    await game.toNextTurn();

    expect(darmanitan.getHpRatio()).toBeLessThan(0.5);
    expect(darmanitan.formIndex).toBe(zenForm);
  });

  it("should stay zen mode when fainted", async () => {
    await game.classicModeHelper.startBattle([Species.DARMANITAN, Species.CHARIZARD]);
    const darmanitan = game.scene.getPlayerPokemon()!;
    darmanitan.hp = darmanitan.getMaxHp() / 2 + 1;
    expect(darmanitan.formIndex).toBe(baseForm);

    game.moveHelper.select(Moves.SPLASH);
    await game.toNextTurn();

    expect(darmanitan.getHpRatio()).toBeLessThan(0.5);
    expect(darmanitan.formIndex).toBe(zenForm);

    game.moveHelper.select(Moves.SPLASH);
    await game.killPokemon(darmanitan);
    game.doSelectPartyPokemon(1);
    await game.toNextTurn();

    expect(darmanitan.isFainted()).toBe(true);
    expect(game.scene.getPlayerParty()[1].formIndex).toBe(zenForm);
  });

  it("should switch to base form on arena reset", async () => {
    game.overridesHelper.startingWave(4);
    game.overridesHelper.starterForms({
      [Species.DARMANITAN]: zenForm,
    });

    await game.classicModeHelper.startBattle([Species.MAGIKARP, Species.DARMANITAN]);

    const darmanitan = game.scene.getPlayerParty()[1];
    darmanitan.hp = 1;
    expect(darmanitan.formIndex).toBe(zenForm);

    darmanitan.hp = 0;
    darmanitan.status = new Status(StatusEffect.FAINT);
    expect(darmanitan.isFainted()).toBe(true);

    game.moveHelper.select(Moves.SPLASH);
    await game.doKillOpponents();
    await game.toNextWave();

    expect(darmanitan.formIndex).toBe(baseForm);
  });
});
