import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { Abilities } from "#enums/abilities";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Imprison", () => {
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
      .battleType("single")
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset([MoveId.IMPRISON, MoveId.SPLASH, MoveId.GROWL])
      .enemySpecies(Species.SHUCKLE)
      .moveset([MoveId.TRANSFORM, MoveId.SPLASH]);
  });

  it("Pokemon under Imprison cannot use shared moves", async () => {
    await game.classicMode.startBattle([Species.REGIELEKI]);

    const playerPokemon = game.scene.getPlayerPokemon()!;

    game.move.select(MoveId.TRANSFORM);
    await game.forceEnemyMove(MoveId.IMPRISON);
    await game.toNextTurn();
    const playerMoveset = playerPokemon.getMoveset().map((x) => x?.moveId);
    const enemyMoveset = game.scene
      .getEnemyPokemon()!
      .getMoveset()
      .map((x) => x?.moveId);
    expect(enemyMoveset.includes(playerMoveset[0])).toBeTruthy();

    // Second turn, Imprison forces Struggle to occur
    game.move.select(MoveId.SPLASH);
    await game.forceEnemyMove(MoveId.SPLASH);
    await game.toNextTurn();
    const move1 = playerPokemon.getLastXMoves(1)[0]!;
    expect(move1.move.id).toBe(MoveId.STRUGGLE);
  });
});
