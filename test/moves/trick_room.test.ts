import { Abilities } from "#enums/abilities";
import { BattlerIndex } from "#enums/battler-index";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Trick Room", () => {
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
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should reverse speed order", async () => {
    await game.classicMode.startBattle([Species.REGIELEKI]);

    game.move.use(MoveId.SPLASH);
    await game.toEndOfTurn();

    expect(game.field.getSpeedOrder()).toEqual([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    expect(game.field.getTurnOrder()).toEqual(game.field.getSpeedOrder());

    await game.toNextTurn();
    game.move.use(MoveId.TRICK_ROOM);
    await game.toNextTurn();

    game.move.use(MoveId.SPLASH);
    await game.toEndOfTurn();

    expect(game.field.getSpeedOrder()).toEqual([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    expect(game.field.getTurnOrder()).toEqual([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
  });

  it("should cancel an active Trick Room if used again", async () => {
    game.override.enemyMoveset([]);
    await game.classicMode.startBattle([Species.REGIELEKI]);

    game.move.use(MoveId.TRICK_ROOM);
    await game.move.forceEnemyMove(MoveId.TRICK_ROOM);
    await game.toNextTurn();

    game.move.use(MoveId.SPLASH);
    await game.move.forceEnemyMove(MoveId.SPLASH);
    await game.toEndOfTurn();

    expect(game.field.getSpeedOrder()).toEqual([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    expect(game.field.getTurnOrder()).toEqual(game.field.getSpeedOrder());
  });
});
