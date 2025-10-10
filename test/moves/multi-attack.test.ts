import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { MoveResult } from "#enums/move-result";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move - Multi Attack", () => {
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
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should not have its type changed by Galvanize", async () => {
    game.override //
      .ability(AbilityId.GALVANIZE)
      .enemySpecies(SpeciesId.DUGTRIO);
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    game.move.use(MoveId.MULTI_ATTACK);
    await game.toEndOfTurn();

    expect(game.field.getEnemyPokemon()).not.toHaveFullHp();
    expect(game.field.getPlayerPokemon()).toHaveMoveResult(MoveResult.SUCCESS);
  });
});
