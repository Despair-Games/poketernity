import { AbilityId } from "#enums/ability-id";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { MoveResult } from "#enums/move-result";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Taunt", () => {
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
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset([MoveId.TAUNT, MoveId.SPLASH])
      .enemySpecies(SpeciesId.SHUCKLE)
      .moveset([MoveId.GROWL]);
  });

  it("Pokemon should not be able to use Status Moves", async () => {
    await game.classicMode.startBattle([SpeciesId.REGIELEKI]);

    const playerPokemon = game.scene.getPlayerPokemon()!;

    // First turn, Player Pokemon succeeds using Growl without Taunt
    game.move.select(MoveId.GROWL);
    await game.move.selectEnemyMove(MoveId.TAUNT);
    await game.toNextTurn();
    expect(playerPokemon).toHaveUsedMove(MoveId.GROWL);
    expect(playerPokemon).toHaveMoveResult(MoveResult.SUCCESS);
    expect(playerPokemon?.getTag(BattlerTagType.TAUNT)).toBeDefined();

    // Second turn, Taunt forces Struggle to occur
    game.move.select(MoveId.GROWL);
    await game.move.selectEnemyMove(MoveId.SPLASH);
    await game.toNextTurn();
    expect(playerPokemon).toHaveUsedMove(MoveId.STRUGGLE);
  });
});
