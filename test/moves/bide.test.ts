import { allMoves } from "#data/data-lists";
import { AbilityId } from "#enums/ability-id";
import { BattlerIndex } from "#enums/battler-index";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { MoveResult } from "#enums/move-result";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import type { TurnMove } from "#types/turn-move";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Bide", () => {
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
      .ability(AbilityId.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.CHANSEY)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.TACKLE)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should cause the user to store energy for 2 turns, then attack for 2x received damage", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.BIDE);

    // For the next 2 turns, expect the player to "store energy" with Bide
    for (let i = 0; i < 2; i++) {
      await game.toEndOfTurn();

      expect(player.getTag(BattlerTagType.BIDE)).toBeDefined();
      expect(player.getMoveQueue()).toContainEqual<TurnMove>(
        expect.objectContaining({
          move: allMoves.get(MoveId.BIDE),
          ignorePP: true,
        }),
      );
      expect(enemy.isFullHp()).toBeTruthy();
    }

    const receivedDamage = player.getInverseHp();
    // For test stability; we don't want the enemy to faint from Bide's attack
    expect(receivedDamage).toBeLessThan(enemy.getMaxHp() / 2);

    await game.toEndOfTurn();

    expect(player.getTag(BattlerTagType.BIDE)).toBeUndefined();
    expect(enemy).toHaveTakenDamage(receivedDamage * 2);
  });

  it("should fail on the last turn if the user was not attacked", async () => {
    game.override.enemyMoveset(MoveId.SPLASH);

    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    const player = game.field.getPlayerPokemon();

    game.move.use(MoveId.BIDE);

    for (let i = 0; i < 2; i++) {
      await game.toEndOfTurn();
      expect(player).toHaveMoveResult(MoveResult.SUCCESS);
    }

    await game.toEndOfTurn();
    expect(player).toHaveMoveResult(MoveResult.FAIL);
  });

  it("should stop execution if the user falls asleep", async () => {
    game.override.enemyMoveset(MoveId.SPORE);

    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    const player = game.field.getPlayerPokemon();

    game.move.use(MoveId.BIDE);
    await game.toEndOfTurn();
    expect(player.getMoveQueue()).toContainEqual(
      expect.objectContaining({
        move: allMoves.get(MoveId.BIDE),
        ignorePP: true,
      }),
    );

    await game.toEndOfTurn();
    expect(player.getMoveQueue()).toHaveLength(0);
  });

  // Unimplemented, full Paralysis cancels the move entirely
  it.todo("should pause execution if the user is fully paralyzed");

  // Unimplemented, flinching cancels the move entirely
  it.todo("should pause execution if the user flinches");

  it("should not affect Ghost-type Pokemon", async () => {
    game.override.enemySpecies(SpeciesId.DRIFLOON);

    await game.classicMode.startBattle([SpeciesId.AGGRON]);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.BIDE);

    for (let i = 0; i < 3; i++) {
      await game.toEndOfTurn();
    }

    expect(player).toHaveMoveResult(MoveResult.FAIL);
    expect(enemy).toHaveFullHp();
  });

  it("should target the last Pokemon that attacked the user", async () => {
    game.override.battleType("double");

    await game.classicMode.startBattle([SpeciesId.MAGIKARP, SpeciesId.FEEBAS]);

    const enemyPokemon = game.scene.getEnemyField();

    game.move.use(MoveId.BIDE, 0);
    game.move.use(MoveId.BIDE, 1);
    await game.move.forceEnemyMove(MoveId.TACKLE, BattlerIndex.PLAYER);
    await game.move.forceEnemyMove(MoveId.TACKLE, BattlerIndex.PLAYER_2);

    await game.toEndOfTurn();
    // Player Pokemon should store energy the next turn
    await game.move.forceEnemyMove(MoveId.SPLASH);
    await game.move.forceEnemyMove(MoveId.TACKLE, BattlerIndex.PLAYER);

    await game.toEndOfTurn();

    await game.toEndOfTurn();

    expect(enemyPokemon[0]).toHaveFullHp();
    expect(enemyPokemon[1]).not.toHaveFullHp();
  });

  // Unimplemented, priority is statically calculated each turn
  it.todo("should execute all phases of the move with the same priority");
});
