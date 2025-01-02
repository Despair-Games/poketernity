import { Stat } from "#enums/stat";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, it, expect } from "vitest";

describe("Abilities - Illuminate", () => {
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
      .moveset(Moves.SPLASH)
      .ability(Abilities.ILLUMINATE)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(Moves.SAND_ATTACK);
  });

  it("should prevent ACC stat stage from being lowered", async () => {
    game.overridesHelper.battleType("single");

    await game.classicModeHelper.startBattle();

    const player = game.scene.getPlayerPokemon()!;

    expect(player.getStatStage(Stat.ACC)).toBe(0);

    game.moveHelper.select(Moves.SPLASH);

    await game.toNextTurn();

    expect(player.getStatStage(Stat.ACC)).toBe(0);
  });

  it("should guarantee double battle with any one LURE", async () => {
    game.overridesHelper.startingModifier([{ name: "LURE" }]).startingWave(2);

    await game.classicModeHelper.startBattle();

    expect(game.scene.getEnemyField().length).toBe(2);
  });
});
