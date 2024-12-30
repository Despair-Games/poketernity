import { ArenaTagSide } from "#app/data/arena-tag";
import { ArenaTagType } from "#enums/arena-tag-type";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, test } from "vitest";

describe("Moves - Court Change", () => {
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

    game.override.battleType("single");

    game.override.moveset([Moves.COURT_CHANGE, Moves.SAFEGUARD]);
    game.override.enemySpecies(Species.NINJASK);

    game.override.startingLevel(100);
    game.override.enemyLevel(100);
  });

  test("should swap arena tags to opponent", async () => {
    await game.classicMode.startBattle([Species.SHUCKLE]);
    game.override.enemyMoveset([Moves.SPLASH]);

    game.move.select(Moves.SAFEGUARD);
    await game.toNextTurn();

    expect(game.scene.arena.getTagOnSide(ArenaTagType.SAFEGUARD, ArenaTagSide.PLAYER)?.tagType).toBe(
      ArenaTagType.SAFEGUARD,
    );
    expect(game.scene.arena.getTagOnSide(ArenaTagType.SAFEGUARD, ArenaTagSide.ENEMY)).toBeUndefined();

    game.move.select(Moves.COURT_CHANGE);
    await game.toNextTurn();

    expect(game.scene.arena.getTagOnSide(ArenaTagType.SAFEGUARD, ArenaTagSide.ENEMY)?.tagType).toBe(
      ArenaTagType.SAFEGUARD,
    );
    expect(game.scene.arena.getTagOnSide(ArenaTagType.SAFEGUARD, ArenaTagSide.PLAYER)).toBeUndefined();
  });

  test("should not miss", async () => {
    await game.classicMode.startBattle([Species.SHUCKLE]);

    game.override.enemyMoveset([Moves.FLY]);

    game.move.select(Moves.SPLASH);
    await game.toNextTurn();
    game.move.select(Moves.SAFEGUARD);
    await game.toNextTurn();

    expect(game.scene.arena.getTagOnSide(ArenaTagType.SAFEGUARD, ArenaTagSide.PLAYER)?.tagType).toBe(
      ArenaTagType.SAFEGUARD,
    );
    expect(game.scene.arena.getTagOnSide(ArenaTagType.SAFEGUARD, ArenaTagSide.ENEMY)).toBeUndefined();

    game.move.select(Moves.COURT_CHANGE);
    await game.toNextTurn();

    expect(game.scene.arena.getTagOnSide(ArenaTagType.SAFEGUARD, ArenaTagSide.ENEMY)?.tagType).toBe(
      ArenaTagType.SAFEGUARD,
    );
    expect(game.scene.arena.getTagOnSide(ArenaTagType.SAFEGUARD, ArenaTagSide.PLAYER)).toBeUndefined();
  });
});
