import { allMoves } from "#app/data/data-lists";
import { Abilities } from "#enums/abilities";
import { BattlerIndex } from "#enums/battler-index";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { MoveResult } from "#enums/move-result";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Moves - Thrash", () => {
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
      .ability(Abilities.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.SKARMORY)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .startingLevel(100)
      .enemyLevel(100);

    vi.spyOn(allMoves[MoveId.ASTONISH], "chance", "get").mockReturnValue(100);
  });

  it("should lock the user into using Thrash for 1-2 turns, then confuse the user", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const player = game.field.getPlayerPokemon();

    game.move.use(MoveId.THRASH);
    await game.toNextTurn();

    const thrashTag = player.getTag(BattlerTagType.FRENZY);
    expect(thrashTag).toBeDefined();
    expect(player.getTag(BattlerTagType.CONFUSED)).toBeUndefined();

    const turnCount = thrashTag!.turnCount;
    expect(turnCount).toBeOneOf([1, 2]);
    for (let i = 0; i < turnCount; i++) {
      await game.toNextTurn();
    }

    expect(player.getMoveHistory().every((tm) => tm.move.id === MoveId.THRASH)).toBeTruthy();
    expect(player.getTag(BattlerTagType.CONFUSED)).toBeDefined();
  });

  it("should not lock the user into using Thrash when the move has no effect", async () => {
    game.override.enemySpecies(Species.DUSCLOPS);

    await game.classicMode.startBattle([Species.FEEBAS]);

    const player = game.field.getPlayerPokemon();

    game.move.use(MoveId.THRASH);
    await game.toNextTurn();

    expect(player.getTag(BattlerTagType.FRENZY)).toBeUndefined();
    expect(player.getMoveQueue()).toHaveLength(0);
  });

  // NOTE: this and following tests assume Frenzy's random turn count is mocked to the max turn length
  // as is currently done in GameManager's constructor
  it("should cancel future uses of Thrash if interrupted by status", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const player = game.field.getPlayerPokemon();

    game.move.use(MoveId.THRASH);
    await game.toNextTurn();

    await game.move.forceEnemyMove(MoveId.SPORE);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toNextTurn();

    expect(player.getTag(BattlerTagType.FRENZY)).toBeUndefined();
    expect(player.getTag(BattlerTagType.CONFUSED)).toBeUndefined();
  });

  it("should cancel future uses of Thrash if interrupted by flinching", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const player = game.field.getPlayerPokemon();

    game.move.use(MoveId.THRASH);
    await game.toNextTurn();

    await game.move.forceEnemyMove(MoveId.ASTONISH);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toNextTurn();

    expect(player.getTag(BattlerTagType.FRENZY)).toBeUndefined();
    expect(player.getTag(BattlerTagType.CONFUSED)).toBeUndefined();
  });

  it("should confuse the user if the user is interrupted on the last turn of frenzy", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const player = game.field.getPlayerPokemon();

    game.move.use(MoveId.THRASH);
    await game.toNextTurn();

    const turnCount = player.getTag(BattlerTagType.FRENZY)?.turnCount;

    if (turnCount) {
      for (let i = 0; i < turnCount - 1; i++) {
        await game.toNextTurn();
      }
    }

    await game.move.forceEnemyMove(MoveId.ASTONISH);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toNextTurn();

    expect(player.getLastXMoves()[0]?.result).toBe(MoveResult.FAIL);
    expect(player.getTag(BattlerTagType.FRENZY)).toBeUndefined();
    expect(player.getTag(BattlerTagType.CONFUSED)).toBeDefined();
  });

  it("should continue execution between waves", async () => {
    game.override.enemyLevel(1);

    await game.classicMode.startBattle([Species.MAGIKARP]);

    const player = game.field.getPlayerPokemon();

    game.move.use(MoveId.THRASH);
    await game.toNextWave();

    expect(player.getTag(BattlerTagType.FRENZY)).toBeDefined();
    expect(player.getMoveQueue()[0]).toMatchObject({
      move: expect.objectContaining({ id: MoveId.THRASH }),
      targets: [BattlerIndex.ENEMY],
      ignorePP: true,
    });

    const nextEnemy = game.field.getEnemyPokemon();

    await game.phaseInterceptor.to("FaintPhase", false);
    expect(nextEnemy.isFainted()).toBeTruthy();
  });
});
