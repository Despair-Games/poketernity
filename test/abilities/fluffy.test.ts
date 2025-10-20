import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Abilities - Fluffy", () => {
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
      .moveset([MoveId.TACKLE, MoveId.EMBER, MoveId.FIRE_FANG])
      .ability(AbilityId.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.RATTATA)
      .enemyAbility(AbilityId.FLUFFY)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("should reduce the damage of contact moves by half", async () => {
    await game.classicMode.startBattle(SpeciesId.FEEBAS);
    const enemy = game.field.getEnemyPokemon();
    const baseDmgSpy = vi.spyOn(enemy, "getBaseDamage");

    game.move.select(MoveId.TACKLE);
    await game.toEndOfTurn();

    expect(baseDmgSpy).toHaveBeenCalled();
    const baseDamage: number = baseDmgSpy.mock.results.at(-1)!.value;
    expect(enemy).toHaveTakenDamage(Math.floor(baseDamage * 0.5));
  });

  it("should double the damage of a non-contact fire move", async () => {
    await game.classicMode.startBattle(SpeciesId.FEEBAS);
    const enemy = game.field.getEnemyPokemon();
    const baseDmgSpy = vi.spyOn(enemy, "getBaseDamage");

    game.move.select(MoveId.EMBER);
    await game.toEndOfTurn();

    expect(baseDmgSpy).toHaveBeenCalled();
    const baseDamage: number = baseDmgSpy.mock.results.at(-1)!.value;
    expect(enemy).toHaveTakenDamage(Math.floor(baseDamage * 2));
  });

  it("should not alter the damage of a contact-making fire move", async () => {
    await game.classicMode.startBattle(SpeciesId.FEEBAS);
    const enemy = game.field.getEnemyPokemon();
    const baseDmgSpy = vi.spyOn(enemy, "getBaseDamage");

    game.move.select(MoveId.FIRE_FANG);
    await game.move.forceHit();
    await game.toEndOfTurn();

    expect(baseDmgSpy).toHaveBeenCalled();
    const baseDamage: number = baseDmgSpy.mock.results.at(-1)!.value;
    expect(enemy).toHaveTakenDamage(baseDamage);
  });

  it("should not alter the damage of contact moves if the attacker has the ability Long Reach", async () => {
    game.override.ability(AbilityId.LONG_REACH);
    await game.classicMode.startBattle(SpeciesId.FEEBAS);
    const enemy = game.field.getEnemyPokemon();
    const baseDmgSpy = vi.spyOn(enemy, "getBaseDamage");

    game.move.select(MoveId.TACKLE);
    await game.toEndOfTurn();

    expect(baseDmgSpy).toHaveBeenCalled();
    const baseDamage: number = baseDmgSpy.mock.results.at(-1)!.value;
    expect(enemy).toHaveTakenDamage(baseDamage);
  });
});
