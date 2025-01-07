import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Happy Hour", () => {
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
      .moveset([Moves.HAPPY_HOUR, Moves.PAY_DAY])
      .ability(Abilities.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(Moves.SPLASH)
      .startingLevel(100);
  });

  it("should double the player's money earnings", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const moneyAmounts = [game.scene.money];

    // Wave 1: Earn money from Pay Day without using Happy Hour
    game.move.select(Moves.PAY_DAY);
    await game.toNextWave();
    moneyAmounts.push(game.scene.money);

    // Wave 2: Earn money from Pay Day, boosted by Happy Hour
    game.move.select(Moves.HAPPY_HOUR);
    await game.toNextTurn();
    game.move.select(Moves.PAY_DAY);
    await game.toNextWave();
    moneyAmounts.push(game.scene.money);

    const earnings1 = moneyAmounts[1] - moneyAmounts[0];
    const earnings2 = moneyAmounts[2] - moneyAmounts[1];
    expect(earnings2).toBe(2 * earnings1);
  });
});
