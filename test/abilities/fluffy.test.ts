import { allMoves } from "#data/data-lists";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { AbilityId } from "#enums/ability-id";
import { MoveFlags } from "#enums/move-flags";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import type { NumberHolder } from "#utils/common-utils";
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
    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();
    const abilitySpy = vi.spyOn(enemy.getAbility().getAttrs(AbAttrFlag.RECEIVED_MOVE_DAMAGE_MULTIPLIER)[0], "apply");

    game.move.select(MoveId.TACKLE);
    await game.toEndOfTurn();

    const damageMultiplier = (abilitySpy.mock.lastCall?.[4] as NumberHolder).value;
    const tackleMove = allMoves.get(MoveId.TACKLE);
    // @ts-expect-error - `hasFlag()` is private but we want to validate the flag is set
    expect(tackleMove.hasFlag(MoveFlags.MAKES_CONTACT)).toBe(true);
    expect(tackleMove.checkFlag(MoveFlags.MAKES_CONTACT, player, enemy)).toBe(true);
    expect(damageMultiplier).toBe(0.5);
  });

  it("should double the damage of a non-contact fire move", async () => {
    await game.classicMode.startBattle(SpeciesId.FEEBAS);
    const enemy = game.scene.getEnemyPokemon()!;
    const abilitySpy = vi.spyOn(enemy.getAbility().getAttrs(AbAttrFlag.RECEIVED_MOVE_DAMAGE_MULTIPLIER)[0], "apply");

    game.move.select(MoveId.EMBER);
    await game.toEndOfTurn();

    const damageMultiplier = (abilitySpy.mock.lastCall?.[4] as NumberHolder).value;
    expect(damageMultiplier).toBe(2);
  });

  it("should not alter the damage of a contact-making fire move", async () => {
    await game.classicMode.startBattle(SpeciesId.FEEBAS);
    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();
    const abilitySpy = vi.spyOn(enemy.getAbility().getAttrs(AbAttrFlag.RECEIVED_MOVE_DAMAGE_MULTIPLIER)[0], "apply");

    game.move.select(MoveId.FIRE_FANG);
    await game.move.forceHit();
    await game.toEndOfTurn();

    const damageMultiplier = (abilitySpy.mock.lastCall?.[4] as NumberHolder).value;
    const fireFangMove = allMoves.get(MoveId.FIRE_FANG);
    // @ts-expect-error - `hasFlag()` is private but we want to validate the flag is set
    expect(fireFangMove.hasFlag(MoveFlags.MAKES_CONTACT)).toBe(true);
    expect(fireFangMove.checkFlag(MoveFlags.MAKES_CONTACT, player, enemy)).toBe(true);
    expect(damageMultiplier).toBe(1);
  });

  it("should not alter the damage of contact moves if the attacker has the ability Long Reach", async () => {
    game.override.ability(AbilityId.LONG_REACH);
    await game.classicMode.startBattle(SpeciesId.FEEBAS);
    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();
    const abilitySpy = vi.spyOn(enemy.getAbility().getAttrs(AbAttrFlag.RECEIVED_MOVE_DAMAGE_MULTIPLIER)[0], "apply");

    game.move.select(MoveId.TACKLE);
    await game.toEndOfTurn();

    const damageMultiplier = (abilitySpy.mock.lastCall?.[4] as NumberHolder).value;
    const tackleMove = allMoves.get(MoveId.TACKLE);
    // @ts-expect-error - `hasFlag()` is private but we want to validate the flag is set
    expect(tackleMove.hasFlag(MoveFlags.MAKES_CONTACT)).toBe(true);
    expect(tackleMove.checkFlag(MoveFlags.MAKES_CONTACT, player, enemy)).toBe(false);
    expect(damageMultiplier).toBe(1);
  });
});
