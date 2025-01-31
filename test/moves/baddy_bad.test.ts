import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Baddy Bad", () => {
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
      .moveset([MoveId.SPLASH])
      .battleType("single")
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .ability(Abilities.BALL_FETCH);
  });

  it("should not activate Reflect if the move fails due to Protect", async () => {
    game.override.enemyMoveset(MoveId.PROTECT);
    await game.classicMode.startBattle([Species.FEEBAS]);

    game.move.select(MoveId.BADDY_BAD);
    await game.phaseInterceptor.to("BerryPhase");

    expect(game.scene.arena.tags.length).toBe(0);
  });
});
