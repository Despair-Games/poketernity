import { Abilities } from "#enums/abilities";
import { BattlerIndex } from "#enums/battler-index";
import { MoveId } from "#enums/move-id";
import { MoveResult } from "#enums/move-result";
import { Species } from "#enums/species";
import { Stat } from "#enums/stat";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Quash", () => {
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
      .battleType("double")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  /**
   * Sets all active Pokemon's speed to controlled values
   * such that the natural speed order should always be
   * Player 1 -> Player 2 -> Enemy 1 -> Enemy 2.
   */
  const setFieldSpeed = () => {
    const field = game.scene.getField(true);
    field[0].setStat(Stat.SPD, 100);
    field[1].setStat(Stat.SPD, 80);
    field[2].setStat(Stat.SPD, 60);
    field[3].setStat(Stat.SPD, 40);
  };

  it("should force the target to move last", async () => {
    await game.classicMode.startBattle([Species.FEEBAS, Species.MAGIKARP]);

    setFieldSpeed();

    game.move.use(MoveId.QUASH, 0, BattlerIndex.ENEMY);
    game.move.use(MoveId.SPLASH, 1);

    await game.toEndOfTurn();

    const turnOrder = game.field.getTurnOrder();
    expect(turnOrder).toEqual([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY_2, BattlerIndex.ENEMY]);
    expect(turnOrder).not.toEqual(game.field.getSpeedOrder());
  });

  it("should override the target's move priority", async () => {
    game.override.ability(Abilities.PRANKSTER);

    await game.classicMode.startBattle([Species.FEEBAS, Species.MAGIKARP]);

    setFieldSpeed();

    /**
     * Player 1 selects Quash targeting Player 2, then Player 2 selects Splash.
     * Both moves should have boosted priority from Prankster, but Player 2
     * should move last after being quashed.
     */
    game.move.use(MoveId.QUASH, 0, BattlerIndex.PLAYER_2);
    game.move.use(MoveId.SPLASH, 1);

    await game.toEndOfTurn();

    const turnOrder = game.field.getTurnOrder();
    expect(turnOrder).toEqual([BattlerIndex.PLAYER, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2, BattlerIndex.PLAYER_2]);
  });

  it("should fail if the target has already used a move", async () => {
    await game.classicMode.startBattle([Species.FEEBAS, Species.MAGIKARP]);

    setFieldSpeed();

    /**
     * Player 1 selects Splash, then Player 2 selects Quash targeting Player 1.
     * Player 1 should act first in the turn, meaning Player 2's Quash should fail.
     */
    game.move.use(MoveId.SPLASH, 0);
    game.move.use(MoveId.QUASH, 1, BattlerIndex.PLAYER);

    await game.toEndOfTurn();

    expect(game.scene.getPlayerField()[1].getLastXMoves()[0]?.result).toBe(MoveResult.FAIL);
    expect(game.field.getTurnOrder()).toEqual(game.field.getSpeedOrder());
  });

  it("should fail if the target is already under the effects of Quash", async () => {
    await game.classicMode.startBattle([Species.FEEBAS, Species.MAGIKARP]);

    setFieldSpeed();

    /**
     * Both players target Enemy 2 with Quash.
     * Since Player 2 is slower, its Quash should fail and not Player 1's.
     */
    game.move.use(MoveId.QUASH, 0, BattlerIndex.ENEMY_2);
    game.move.use(MoveId.QUASH, 1, BattlerIndex.ENEMY_2);

    await game.toEndOfTurn();

    expect(game.scene.getPlayerField()[0].getLastXMoves()[0]?.result).toBe(MoveResult.SUCCESS);
    expect(game.scene.getPlayerField()[1].getLastXMoves()[0]?.result).toBe(MoveResult.FAIL);
    // Both used Quash on the slowest enemy, so turn order should match speed order
    expect(game.field.getTurnOrder()).toEqual(game.field.getSpeedOrder());
  });

  it("should have its effects overridden by After You", async () => {
    await game.classicMode.startBattle([Species.FEEBAS, Species.MAGIKARP]);

    setFieldSpeed();

    game.move.use(MoveId.QUASH, 0, BattlerIndex.ENEMY_2);
    game.move.use(MoveId.AFTER_YOU, 1, BattlerIndex.ENEMY_2);

    await game.toEndOfTurn();

    const turnOrder = game.field.getTurnOrder();
    expect(turnOrder).toEqual([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY_2, BattlerIndex.ENEMY]);
    expect(turnOrder).not.toEqual(game.field.getSpeedOrder());
  });

  it("if multiple Pokemon are simultaneously affected by Quash, they should move from fastest to slowest", async () => {
    await game.classicMode.startBattle([Species.FEEBAS, Species.MAGIKARP]);

    setFieldSpeed();

    game.move.use(MoveId.QUASH, 0, BattlerIndex.ENEMY_2);
    game.move.use(MoveId.QUASH, 1, BattlerIndex.ENEMY);

    await game.toEndOfTurn();

    // Both player Pokemon naturally outspeed the opponents, so turn order should match speed order
    expect(game.field.getTurnOrder()).toEqual(game.field.getSpeedOrder());
  });
});
