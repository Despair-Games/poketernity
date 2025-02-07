import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { BattlerIndex } from "#enums/battler-index";

describe("Moves - Bouncy Bubble", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

  beforeAll(() => {
    phaserGame = new Phaser.Game({ type: Phaser.HEADLESS });
  });

  afterEach(() => {
    game.phaseInterceptor.restoreOg();
  });

  beforeEach(() => {
    game = new GameManager(phaserGame);

    game.override
      .battleType("double")
      .enemySpecies(Species.ARCEUS)
      .enemyLevel(100)
      .enemyMoveset([MoveId.SPLASH])
      .enemyAbility(Abilities.BALL_FETCH)
      .startingLevel(100)
      .moveset([MoveId.BOUNCY_BUBBLE])
      .ability(Abilities.BALL_FETCH);
  });

  it("should heal 100% of damage dealt and be single target", async () => {
    await game.classicMode.startBattle([Species.CHANSEY]);
    const user = game.scene.getPlayerPokemon()!;
    const enemy1 = game.scene.getEnemyField()[0];
    const enemy2 = game.scene.getEnemyField()[1];

    user.damageAndUpdate(user.getMaxHp() - 1);

    game.move.select(MoveId.BOUNCY_BUBBLE, 0, BattlerIndex.ENEMY);
    await game.toNextTurn();

    expect(enemy1.getMaxHp() - enemy1.hp).toBe(user.hp - 1);
    expect(enemy2.hp).toBe(enemy2.getMaxHp());
  });
});
