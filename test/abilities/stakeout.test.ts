import { BattlerIndex } from "#enums/battler-index";
import { isBetween } from "#app/utils";
import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - Stakeout", () => {
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
      .moveset([MoveId.SPLASH, MoveId.SURF])
      .ability(Abilities.STAKEOUT)
      .battleType("single")
      .disableCrits()
      .startingLevel(100)
      .enemyLevel(100)
      .enemySpecies(Species.SNORLAX)
      .enemyAbility(Abilities.BALL_FETCH)
      .startingWave(5);
  });

  it("should do double damage to a pokemon that switched out", async () => {
    await game.classicMode.startBattle([Species.MILOTIC]);

    const [enemy1] = game.scene.getEnemyParty();

    game.move.select(MoveId.SURF);
    await game.move.forceEnemyMove(MoveId.SPLASH);
    await game.toNextTurn();
    const damage1 = enemy1.getInverseHp();
    enemy1.hp = enemy1.getMaxHp();

    game.move.select(MoveId.SPLASH);
    game.forceEnemyToSwitch();
    await game.toNextTurn();

    game.move.select(MoveId.SURF);
    game.forceEnemyToSwitch();
    await game.toNextTurn();

    expect(enemy1.isFainted()).toBe(false);
    expect(isBetween(enemy1.getInverseHp(), damage1 * 2 - 5, damage1 * 2 + 5)).toBe(true);
  });

  it("should do double damage to a pokemon that switched out via U-Turn/etc", async () => {
    await game.classicMode.startBattle([Species.MILOTIC]);

    const [enemy1] = game.scene.getEnemyParty();

    game.move.select(MoveId.SURF);
    await game.move.forceEnemyMove(MoveId.SPLASH);
    await game.toNextTurn();
    const damage1 = enemy1.getInverseHp();
    enemy1.hp = enemy1.getMaxHp();

    game.move.select(MoveId.SPLASH);
    await game.move.forceEnemyMove(MoveId.FLIP_TURN);
    await game.toNextTurn();

    game.move.select(MoveId.SURF);
    await game.move.forceEnemyMove(MoveId.FLIP_TURN);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toNextTurn();

    expect(enemy1.isFainted()).toBe(false);
    expect(isBetween(enemy1.getInverseHp(), damage1 * 2 - 5, damage1 * 2 + 5)).toBe(true);
  });
});
