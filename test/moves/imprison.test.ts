import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { AbilityId } from "#enums/ability-id";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { BattlerIndex } from "#enums/battler-index";
import { MoveResult } from "#enums/move-result";
import { StatusEffect } from "#enums/status-effect";
import { BattlerTagType } from "#enums/battler-tag-type";

describe("Moves - Imprison", () => {
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
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset([MoveId.IMPRISON, MoveId.SPLASH, MoveId.GROWL])
      .enemySpecies(SpeciesId.SHUCKLE)
      .moveset([MoveId.TRANSFORM, MoveId.SPLASH]);
  });

  it("should prevent opponents from using moves shared by the user", async () => {
    await game.classicMode.startBattle([SpeciesId.REGIELEKI]);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    game.move.select(MoveId.TRANSFORM);
    await game.move.selectEnemyMove(MoveId.IMPRISON);
    await game.toNextTurn();
    const playerMoveset = player.getMoveset().map((x) => x?.moveId);
    const enemyMoveset = enemy.getMoveset().map((x) => x?.moveId);
    expect(enemyMoveset.includes(playerMoveset[0])).toBeTruthy();

    // Second turn, Imprison forces Struggle to occur
    game.move.select(MoveId.SPLASH);
    await game.move.selectEnemyMove(MoveId.SPLASH);
    await game.toNextTurn();
    expect(player.getLastXMoves()[0]?.move.id).toBe(MoveId.STRUGGLE);
  });

  it("should not prevent allies from using moves shared by the user", async () => {
    game.override.battleType("double").moveset([MoveId.IMPRISON, MoveId.SPLASH]).enemyMoveset(MoveId.SPLASH);

    await game.classicMode.startBattle([SpeciesId.FEEBAS, SpeciesId.MAGIKARP]);

    const playerPokemon = game.scene.getPlayerField();
    const enemyPokemon = game.scene.getEnemyField();

    game.move.select(MoveId.IMPRISON, 0);
    game.move.select(MoveId.SPLASH);

    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);

    await game.toNextTurn();
    playerPokemon.forEach((p) => expect(p.getLastXMoves()[0]?.result).toBe(MoveResult.SUCCESS));
    enemyPokemon.forEach((p) => expect(p.getLastXMoves()[0]?.result).toBe(MoveResult.FAIL));
  });

  it("should not interrupt moves invoked by Sleep Talk", async () => {
    game.override
      .moveset([MoveId.IMPRISON, MoveId.SPLASH])
      .enemyMoveset([MoveId.SPLASH, MoveId.SLEEP_TALK])
      .enemyStatusEffect(StatusEffect.SLEEP);

    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    const enemyPokemon = game.field.getEnemyPokemon();

    game.move.select(MoveId.IMPRISON);
    await game.move.selectEnemyMove(MoveId.SLEEP_TALK);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);

    await game.toNextTurn();
    expect(enemyPokemon.getMoveHistory().map((turnMove) => turnMove.result)).toEqual(Array(2).fill(MoveResult.SUCCESS));
  });

  it("should not interfere with the effects of an ally's Imprison", async () => {
    game.override
      .battleType("double")
      .moveset([]) // Moves are set manually for this test
      .enemyMoveset([MoveId.SPLASH, MoveId.CELEBRATE]);

    await game.classicMode.startBattle([SpeciesId.FEEBAS, SpeciesId.MAGIKARP]);

    const [feebas, magikarp] = game.scene.getPlayerField();
    const enemyPokemon = game.scene.getEnemyField();

    game.move.changeMoveset(feebas, [MoveId.IMPRISON, MoveId.SPLASH]);
    game.move.changeMoveset(magikarp, [MoveId.IMPRISON, MoveId.CELEBRATE]);

    game.move.select(MoveId.IMPRISON, 0);
    game.move.select(MoveId.IMPRISON, 1);

    await game.move.selectEnemyMove(MoveId.SPLASH);
    await game.move.selectEnemyMove(MoveId.SPLASH);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);

    await game.toNextTurn();

    [feebas, magikarp].forEach((p) => expect(p.getTag(BattlerTagType.IMPRISONING)).toBeDefined());
    enemyPokemon.forEach((p) => expect(p.getLastXMoves()[0]?.result).toBe(MoveResult.FAIL));

    game.move.select(MoveId.SPLASH, 0);
    game.move.select(MoveId.CELEBRATE, 1);

    await game.toNextTurn();

    enemyPokemon.forEach((p) => expect(p.getLastXMoves()[0]?.move.id).toBe(MoveId.STRUGGLE));
  });

  it("should disable matching moves for opponents that enter the field afterward", async () => {
    game.override.moveset([MoveId.SPLASH, MoveId.GROWL]);

    await game.classicMode.startBattle([SpeciesId.FEEBAS, SpeciesId.MAGIKARP]);

    game.move.select(MoveId.SPLASH);
    await game.move.selectEnemyMove(MoveId.IMPRISON);
    await game.toNextTurn();

    game.doSwitchPokemon(1);
    await game.move.selectEnemyMove(MoveId.SPLASH);
    await game.toNextTurn();

    game.move.select(MoveId.SPLASH);
    await game.move.selectEnemyMove(MoveId.SPLASH);
    await game.toEndOfTurn();

    const player = game.field.getPlayerPokemon();

    expect(player.getLastXMoves()[0]?.move.id).toBe(MoveId.STRUGGLE);
  });
});
