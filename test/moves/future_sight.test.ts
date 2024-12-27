import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Future Sight", () => {
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
      .moveset([Moves.FUTURE_SIGHT, Moves.SPLASH])
      .battleType("single")
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.STURDY)
      .enemyMoveset(Moves.SPLASH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  const passTurns = async (numTurns: number, double: boolean = false) => {
    for (let i = 0; i < numTurns; i++) {
      game.move.select(Moves.SPLASH, 0);
      if (double) {
        game.move.select(Moves.SPLASH, 1);
      }
      await game.toNextTurn();
    }
  };

  it("should hit 2 turns after use", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const enemy = game.scene.getEnemyPokemon()!;

    game.move.select(Moves.FUTURE_SIGHT);
    await game.toNextTurn();

    expect(enemy.isFullHp()).toBeTruthy();

    await passTurns(2);

    expect(enemy.isFullHp()).toBeFalsy();
  });

  it("should not be cancelled after the user switches out", async () => {
    await game.classicMode.startBattle([Species.FEEBAS, Species.MILOTIC]);

    game.move.select(Moves.FUTURE_SIGHT);
    await game.toNextTurn();
    game.doSwitchPokemon(1);
    await game.toNextTurn();
    await passTurns(1);

    expect(game.scene.getEnemyPokemon()!.isFullHp()).toBe(false);
  });

  it.todo("should inflict damage as a Psychic-type move");

  it.todo("should inflict damage as a Normal-type move if the user is active with Normalize");

  it.todo("the target should endure inflicted damage from this move with Sturdy");

  it.todo("should not apply the user's abilities when dealing damage if the user is inactive");

  it.todo("should not apply the user's held items when dealing damage if the user is inactive");

  it.todo("should redirect damage if no Pokemon is active in the original targeted index");
});
