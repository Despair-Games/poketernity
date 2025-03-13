import { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/test-utils/gameManager";
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

    game.override.moveset([MoveId.COURT_CHANGE, MoveId.SAFEGUARD]);
    game.override.enemySpecies(Species.NINJASK);

    game.override.startingLevel(100);
    game.override.enemyLevel(100);
  });

  test("should swap arena tags to opponent", async () => {
    await game.classicMode.startBattle([Species.SHUCKLE]);
    game.override.enemyMoveset([MoveId.SPLASH]);

    game.move.select(MoveId.SAFEGUARD);
    await game.toNextTurn();

    const tag1 = game.scene.arena.getTagOnSide(ArenaTagType.SAFEGUARD, ArenaTagSide.PLAYER);
    expect(tag1?.tagType).toBe(ArenaTagType.SAFEGUARD);
    expect(tag1?.turnCount).toBe(4);
    expect(game.scene.arena.getTagOnSide(ArenaTagType.SAFEGUARD, ArenaTagSide.ENEMY)).toBeUndefined();

    game.move.select(MoveId.COURT_CHANGE);
    await game.toNextTurn();

    const tag2 = game.scene.arena.getTagOnSide(ArenaTagType.SAFEGUARD, ArenaTagSide.ENEMY);
    expect(tag2?.tagType).toBe(ArenaTagType.SAFEGUARD);
    expect(tag2?.turnCount).toBe(3);
    expect(game.scene.arena.getTagOnSide(ArenaTagType.SAFEGUARD, ArenaTagSide.PLAYER)).toBeUndefined();
  });

  test("should not miss", async () => {
    await game.classicMode.startBattle([Species.SHUCKLE]);

    game.override.enemyMoveset([MoveId.FLY]);

    game.move.select(MoveId.SPLASH);
    await game.toNextTurn();
    game.move.select(MoveId.SAFEGUARD);
    await game.toNextTurn();

    expect(game.scene.arena.getTagOnSide(ArenaTagType.SAFEGUARD, ArenaTagSide.PLAYER)?.tagType).toBe(
      ArenaTagType.SAFEGUARD,
    );
    expect(game.scene.arena.getTagOnSide(ArenaTagType.SAFEGUARD, ArenaTagSide.ENEMY)).toBeUndefined();

    game.move.select(MoveId.COURT_CHANGE);
    await game.toNextTurn();

    expect(game.scene.arena.getTagOnSide(ArenaTagType.SAFEGUARD, ArenaTagSide.ENEMY)?.tagType).toBe(
      ArenaTagType.SAFEGUARD,
    );
    expect(game.scene.arena.getTagOnSide(ArenaTagType.SAFEGUARD, ArenaTagSide.PLAYER)).toBeUndefined();
  });
});
