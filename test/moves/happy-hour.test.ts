import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
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
      .moveset([MoveId.HAPPY_HOUR, MoveId.PAY_DAY])
      .ability(AbilityId.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .startingLevel(100);
  });

  it("should double the player's money earnings", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    const moneyAmounts = [game.scene.money];

    // Wave 1: Earn money from Pay Day without using Happy Hour
    game.move.select(MoveId.PAY_DAY);
    await game.toNextWave();
    moneyAmounts.push(game.scene.money);

    // Wave 2: Earn money from Pay Day, boosted by Happy Hour
    game.move.select(MoveId.HAPPY_HOUR);
    await game.toNextTurn();
    game.move.select(MoveId.PAY_DAY);
    await game.toNextWave();
    moneyAmounts.push(game.scene.money);

    const earnings1 = moneyAmounts[1] - moneyAmounts[0];
    const earnings2 = moneyAmounts[2] - moneyAmounts[1];
    expect(earnings2).toBe(2 * earnings1);
  });
});
