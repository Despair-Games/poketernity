import { allMoves } from "#app/data/data-lists";
import { Abilities } from "#enums/abilities";
import { MoveFlags } from "#enums/move-flags";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import type { NumberHolder } from "#app/utils";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { AbAttrFlag } from "#enums/ab-attr-flag";

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
      .ability(Abilities.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.RATTATA)
      .enemyAbility(Abilities.FLUFFY)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("should reduce the damage of contact moves by half", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);
    const enemy = game.scene.getEnemyPokemon()!;
    const abilitySpy = vi.spyOn(enemy.getAbility().getAttrs(AbAttrFlag.RECEIVED_MOVE_DAMAGE_MULTIPLIER)[0], "apply");

    game.move.select(MoveId.TACKLE);
    await game.phaseInterceptor.to("BerryPhase");

    const damageMultiplier = (abilitySpy.mock.lastCall?.[4] as NumberHolder).value;
    expect(allMoves[MoveId.TACKLE].hasFlag(MoveFlags.MAKES_CONTACT)).toBe(true);
    expect(damageMultiplier).toBe(0.5);
  });

  it("should double the damage of a non-contact fire move", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);
    const enemy = game.scene.getEnemyPokemon()!;
    const abilitySpy = vi.spyOn(enemy.getAbility().getAttrs(AbAttrFlag.RECEIVED_MOVE_DAMAGE_MULTIPLIER)[0], "apply");

    game.move.select(MoveId.EMBER);
    await game.phaseInterceptor.to("BerryPhase");

    const damageMultiplier = (abilitySpy.mock.lastCall?.[4] as NumberHolder).value;
    expect(damageMultiplier).toBe(2);
  });

  it("should not alter the damage of a contact-making fire move", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);
    const enemy = game.scene.getEnemyPokemon()!;
    const abilitySpy = vi.spyOn(enemy.getAbility().getAttrs(AbAttrFlag.RECEIVED_MOVE_DAMAGE_MULTIPLIER)[0], "apply");

    game.move.select(MoveId.FIRE_FANG);
    await game.move.forceHit();
    await game.phaseInterceptor.to("BerryPhase");

    const damageMultiplier = (abilitySpy.mock.lastCall?.[4] as NumberHolder).value;
    expect(allMoves[MoveId.FIRE_FANG].hasFlag(MoveFlags.MAKES_CONTACT)).toBe(true);
    expect(damageMultiplier).toBe(1);
  });

  it("should not alter the damage of contact moves if the attacker has the ability Long Reach", async () => {
    game.override.ability(Abilities.LONG_REACH);
    await game.classicMode.startBattle([Species.FEEBAS]);
    const enemy = game.scene.getEnemyPokemon()!;
    const abilitySpy = vi.spyOn(enemy.getAbility().getAttrs(AbAttrFlag.RECEIVED_MOVE_DAMAGE_MULTIPLIER)[0], "apply");

    game.move.select(MoveId.TACKLE);
    await game.phaseInterceptor.to("BerryPhase");

    const damageMultiplier = (abilitySpy.mock.lastCall?.[4] as NumberHolder).value;
    expect(allMoves[MoveId.TACKLE].hasFlag(MoveFlags.MAKES_CONTACT)).toBe(true);
    expect(damageMultiplier).toBe(1);
  });
});
