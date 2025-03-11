import { BattlerIndex } from "#enums/battler-index";
import { MoveResult } from "#enums/move-result";
import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Upper Hand", () => {
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
      .moveset(MoveId.UPPER_HAND)
      .ability(Abilities.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.QUICK_ATTACK)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should flinch the opponent before they use a priority attack", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const feebas = game.scene.getPlayerPokemon()!;
    const magikarp = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.UPPER_HAND);
    await game.toEndOfTurn();

    expect(feebas.getLastXMoves()[0].result).toBe(MoveResult.SUCCESS);
    expect(magikarp.isFullHp()).toBeFalsy();
    expect(feebas.isFullHp()).toBeTruthy();
  });

  it.each([
    { descriptor: "non-priority attack", moveId: MoveId.TACKLE },
    { descriptor: "status move", moveId: MoveId.BABY_DOLL_EYES },
  ])("should fail when the opponent selects a $descriptor", async ({ moveId }) => {
    game.override.enemyMoveset(moveId);

    await game.classicMode.startBattle([Species.FEEBAS]);

    const feebas = game.scene.getPlayerPokemon()!;

    game.move.select(MoveId.UPPER_HAND);
    await game.toEndOfTurn();

    expect(feebas.getLastXMoves()[0].result).toBe(MoveResult.FAIL);
  });

  it("should flinch the opponent before they use an attack boosted by Gale Wings", async () => {
    game.override.enemyAbility(Abilities.GALE_WINGS).enemyMoveset(MoveId.GUST);

    await game.classicMode.startBattle([Species.FEEBAS]);

    const feebas = game.scene.getPlayerPokemon()!;
    const magikarp = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.UPPER_HAND);
    await game.toEndOfTurn();

    expect(feebas.getLastXMoves()[0].result).toBe(MoveResult.SUCCESS);
    expect(magikarp.isFullHp()).toBeFalsy();
    expect(feebas.isFullHp()).toBeTruthy();
  });

  it("should fail if the target has already moved", async () => {
    game.override.enemyMoveset(MoveId.FAKE_OUT).enemyAbility(Abilities.SHEER_FORCE);

    await game.classicMode.startBattle([Species.FEEBAS]);

    const feebas = game.scene.getPlayerPokemon()!;

    game.move.select(MoveId.UPPER_HAND);

    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toEndOfTurn();

    expect(feebas.getLastXMoves()[0].result).toBe(MoveResult.FAIL);
    expect(feebas.isFullHp()).toBeFalsy();
  });
});
