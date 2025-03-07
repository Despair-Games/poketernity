import { Abilities } from "#enums/abilities";
import { BattlerIndex } from "#enums/battler-index";
import { MoveResult } from "#enums/move-result";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import { Stat } from "enums/stat";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Mirror Move", () => {
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
      .moveset([MoveId.MIRROR_MOVE, MoveId.SPLASH])
      .ability(Abilities.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("should use the last move that the target used on the user", async () => {
    game.override.battleType("double").enemyMoveset([MoveId.TACKLE, MoveId.GROWL]);
    await game.classicMode.startBattle([Species.FEEBAS, Species.MAGIKARP]);

    game.move.select(MoveId.MIRROR_MOVE, 0, BattlerIndex.ENEMY); // target's last move is Tackle, enemy should receive damage from Mirror Move copying Tackle
    game.move.select(MoveId.SPLASH, 1);
    await game.forceEnemyMove(MoveId.TACKLE, BattlerIndex.PLAYER_2);
    await game.forceEnemyMove(MoveId.GROWL, BattlerIndex.PLAYER_2);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.ENEMY_2, BattlerIndex.PLAYER_2, BattlerIndex.PLAYER]);
    await game.toNextTurn();

    expect(game.scene.getEnemyField()[0].isFullHp()).toBeFalsy();
  });

  it("should apply secondary effects of a move", async () => {
    game.override.enemyMoveset(MoveId.ACID_SPRAY);
    await game.classicMode.startBattle([Species.FEEBAS]);

    game.move.select(MoveId.MIRROR_MOVE);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toNextTurn();

    expect(game.scene.getEnemyPokemon()!.getStatStage(Stat.SPDEF)).toBe(-2);
  });

  it("should be able to copy status moves", async () => {
    game.override.enemyMoveset(MoveId.GROWL);
    await game.classicMode.startBattle([Species.FEEBAS]);

    game.move.select(MoveId.MIRROR_MOVE);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toNextTurn();

    expect(game.scene.getEnemyPokemon()!.getStatStage(Stat.ATK)).toBe(-1);
  });

  it("should fail if the target has not used any moves", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    game.move.select(MoveId.MIRROR_MOVE);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.toNextTurn();

    expect(game.scene.getPlayerPokemon()!.getLastXMoves()[0].result).toBe(MoveResult.FAIL);
  });

  it("should fail if the target last used Mirror Move, without any infinite loop", async () => {
    game.override.enemyMoveset(MoveId.MIRROR_MOVE);
    await game.classicMode.startBattle([Species.FEEBAS]);

    game.move.select(MoveId.MIRROR_MOVE);
    await game.toEndOfTurn();

    for (const pokemon of game.scene.getField()) {
      expect(pokemon.getLastXMoves()[0].result).toBe(MoveResult.FAIL);
    }
  });
});
