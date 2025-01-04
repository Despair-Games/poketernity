import { allMoves } from "#app/data/all-moves";
import type { DamageCalculationResult } from "#app/field/pokemon";
import { Abilities } from "#enums/abilities";
import { MoveFlags } from "#enums/move-flags";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
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
      .moveset([Moves.TACKLE, Moves.EMBER, Moves.FIRE_FANG])
      .ability(Abilities.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.RATTATA)
      .enemyAbility(Abilities.FLUFFY)
      .enemyMoveset(Moves.SPLASH);
  });

  it("should reduce the damage of contact moves by half", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);
    const enemy = game.scene.getEnemyPokemon()!;
    const abilitySpy = vi.spyOn(enemy, "getAttackDamage");

    game.move.select(Moves.TACKLE);
    await game.phaseInterceptor.to("BerryPhase");

    const damageResult = abilitySpy.mock.results[0].value as DamageCalculationResult;
    expect(allMoves[Moves.TACKLE].hasFlag(MoveFlags.MAKES_CONTACT)).toBe(true);
    expect(damageResult.finalDamage).toBe(Math.floor(damageResult.postMultiplierDamage! / 2));
  });

  it("should double the damage of a non-contact fire move", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);
    const enemy = game.scene.getEnemyPokemon()!;
    const abilitySpy = vi.spyOn(enemy, "getAttackDamage");

    game.move.select(Moves.EMBER);
    await game.phaseInterceptor.to("BerryPhase");

    const damageResult = abilitySpy.mock.results[0].value as DamageCalculationResult;
    expect(allMoves[Moves.EMBER].hasFlag(MoveFlags.MAKES_CONTACT)).toBe(false);
    expect(damageResult.finalDamage).toBe(damageResult.postMultiplierDamage! * 2);
  });

  it("should not alter the damage of a contact-making fire move", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);
    const enemy = game.scene.getEnemyPokemon()!;
    const abilitySpy = vi.spyOn(enemy, "getAttackDamage");

    game.move.select(Moves.FIRE_FANG);
    await game.move.forceHit();
    await game.phaseInterceptor.to("BerryPhase");

    const damageResult = abilitySpy.mock.results[0].value as DamageCalculationResult;
    expect(allMoves[Moves.FIRE_FANG].hasFlag(MoveFlags.MAKES_CONTACT)).toBe(true);
    expect(damageResult.finalDamage).toBe(damageResult.postMultiplierDamage);
  });

  it("should not alter the damage of contact moves if the attacker has the ability Long Reach", async () => {
    game.override.ability(Abilities.LONG_REACH);
    await game.classicMode.startBattle([Species.FEEBAS]);
    const enemy = game.scene.getEnemyPokemon()!;
    const abilitySpy = vi.spyOn(enemy, "getAttackDamage");

    game.move.select(Moves.TACKLE);
    await game.phaseInterceptor.to("BerryPhase");

    const damageResult = abilitySpy.mock.results[0].value as DamageCalculationResult;
    expect(allMoves[Moves.TACKLE].hasFlag(MoveFlags.MAKES_CONTACT)).toBe(true);
    expect(damageResult.finalDamage).toBe(Math.floor(damageResult.postMultiplierDamage! * 0.5) * 2);
  });
});
