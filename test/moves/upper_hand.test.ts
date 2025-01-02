import { BattlerIndex } from "#app/battle";
import { MoveResult } from "#app/field/pokemon";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
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
    game.overridesHelper
      .moveset(Moves.UPPER_HAND)
      .ability(Abilities.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(Moves.QUICK_ATTACK)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should flinch the opponent before they use a priority attack", async () => {
    await game.classicModeHelper.startBattle([Species.FEEBAS]);

    const feebas = game.scene.getPlayerPokemon()!;
    const magikarp = game.scene.getEnemyPokemon()!;

    game.moveHelper.select(Moves.UPPER_HAND);
    await game.phaseInterceptor.to("BerryPhase");

    expect(feebas.getLastXMoves()[0].result).toBe(MoveResult.SUCCESS);
    expect(magikarp.isFullHp()).toBeFalsy();
    expect(feebas.isFullHp()).toBeTruthy();
  });

  it.each([
    { descriptor: "non-priority attack", move: Moves.TACKLE },
    { descriptor: "status move", move: Moves.BABY_DOLL_EYES },
  ])("should fail when the opponent selects a $descriptor", async ({ move }) => {
    game.overridesHelper.enemyMoveset(move);

    await game.classicModeHelper.startBattle([Species.FEEBAS]);

    const feebas = game.scene.getPlayerPokemon()!;

    game.moveHelper.select(Moves.UPPER_HAND);
    await game.phaseInterceptor.to("BerryPhase");

    expect(feebas.getLastXMoves()[0].result).toBe(MoveResult.FAIL);
  });

  it("should flinch the opponent before they use an attack boosted by Gale Wings", async () => {
    game.overridesHelper.enemyAbility(Abilities.GALE_WINGS).enemyMoveset(Moves.GUST);

    await game.classicModeHelper.startBattle([Species.FEEBAS]);

    const feebas = game.scene.getPlayerPokemon()!;
    const magikarp = game.scene.getEnemyPokemon()!;

    game.moveHelper.select(Moves.UPPER_HAND);
    await game.phaseInterceptor.to("BerryPhase");

    expect(feebas.getLastXMoves()[0].result).toBe(MoveResult.SUCCESS);
    expect(magikarp.isFullHp()).toBeFalsy();
    expect(feebas.isFullHp()).toBeTruthy();
  });

  it("should fail if the target has already moved", async () => {
    game.overridesHelper.enemyMoveset(Moves.FAKE_OUT).enemyAbility(Abilities.SHEER_FORCE);

    await game.classicModeHelper.startBattle([Species.FEEBAS]);

    const feebas = game.scene.getPlayerPokemon()!;

    game.moveHelper.select(Moves.UPPER_HAND);

    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.phaseInterceptor.to("BerryPhase");

    expect(feebas.getLastXMoves()[0].result).toBe(MoveResult.FAIL);
    expect(feebas.isFullHp()).toBeFalsy();
  });
});
