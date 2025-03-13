import { BattlerTagType } from "#enums/battler-tag-type";
import { BattlerIndex } from "#enums/battler-index";
import { MoveResult } from "#enums/move-result";
import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Encore", () => {
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
      .moveset([MoveId.SPLASH, MoveId.ENCORE])
      .ability(Abilities.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset([MoveId.SPLASH, MoveId.TACKLE])
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should prevent the target from using any move except the last used move", async () => {
    await game.classicMode.startBattle([Species.SNORLAX]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.ENCORE);
    await game.forceEnemyMove(MoveId.SPLASH);

    await game.toNextTurn();
    expect(enemyPokemon.getTag(BattlerTagType.ENCORE)).toBeDefined();

    game.move.select(MoveId.SPLASH);
    // The enemy AI would normally be inclined to use Tackle, but should be
    // forced into using Splash.
    await game.toEndOfTurn();

    expect(enemyPokemon.getLastXMoves().every((turnMove) => turnMove.move.id === MoveId.SPLASH)).toBeTruthy();
  });

  describe("should fail against the following moves:", () => {
    it.each([
      { moveId: MoveId.TRANSFORM, name: "Transform", delay: false },
      { moveId: MoveId.MIMIC, name: "Mimic", delay: true },
      { moveId: MoveId.SKETCH, name: "Sketch", delay: true },
      { moveId: MoveId.ENCORE, name: "Encore", delay: false },
      { moveId: MoveId.STRUGGLE, name: "Struggle", delay: false },
    ])("$name", async ({ moveId, delay }) => {
      game.override.enemyMoveset(moveId);

      await game.classicMode.startBattle([Species.SNORLAX]);

      const playerPokemon = game.scene.getPlayerPokemon()!;
      const enemyPokemon = game.scene.getEnemyPokemon()!;

      if (delay) {
        game.move.select(MoveId.SPLASH);
        game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
        await game.toNextTurn();
      }

      game.move.select(MoveId.ENCORE);

      const turnOrder = delay ? [BattlerIndex.PLAYER, BattlerIndex.ENEMY] : [BattlerIndex.ENEMY, BattlerIndex.PLAYER];
      game.setTurnOrder(turnOrder);

      await game.toEndOfTurn();
      expect(playerPokemon.getLastXMoves(1)[0].result).toBe(MoveResult.FAIL);
      expect(enemyPokemon.getTag(BattlerTagType.ENCORE)).toBeUndefined();
    });
  });

  it("Pokemon under both Encore and Torment should alternate between Struggle and restricted move", async () => {
    const turnOrder = [BattlerIndex.ENEMY, BattlerIndex.PLAYER];
    game.override.moveset([MoveId.ENCORE, MoveId.TORMENT, MoveId.SPLASH]);
    await game.classicMode.startBattle([Species.FEEBAS]);

    const enemyPokemon = game.scene.getEnemyPokemon();
    game.move.select(MoveId.ENCORE);
    game.setTurnOrder(turnOrder);
    await game.toEndOfTurn();
    expect(enemyPokemon?.getTag(BattlerTagType.ENCORE)).toBeDefined();

    await game.toNextTurn();
    game.move.select(MoveId.TORMENT);
    game.setTurnOrder(turnOrder);
    await game.toEndOfTurn();
    expect(enemyPokemon?.getTag(BattlerTagType.TORMENT)).toBeDefined();

    await game.toNextTurn();
    game.move.select(MoveId.SPLASH);
    game.setTurnOrder(turnOrder);
    await game.toEndOfTurn();
    const lastMove = enemyPokemon?.getLastXMoves()[0];
    expect(lastMove?.move.id).toBe(MoveId.STRUGGLE);
  });
});
