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
    game.overridesHelper
      .startingLevel(50)
      .moveset([Moves.FUTURE_SIGHT, Moves.SPLASH])
      .battleType("single")
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.STURDY)
      .enemyMoveset(Moves.SPLASH);
  });

  it("hits 2 turns after use, ignores user switch out", async () => {
    await game.classicModeHelper.startBattle([Species.FEEBAS, Species.MILOTIC]);

    game.moveHelper.select(Moves.FUTURE_SIGHT);
    await game.toNextTurn();
    game.doSwitchPokemon(1);
    await game.toNextTurn();
    game.moveHelper.select(Moves.SPLASH);
    await game.toNextTurn();

    expect(game.scene.getEnemyPokemon()!.isFullHp()).toBe(false);
  });
});
