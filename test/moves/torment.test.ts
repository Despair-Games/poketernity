import { AbilityId } from "#enums/ability-id";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { MoveResult } from "#enums/move-result";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Torment", () => {
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
      .enemyMoveset([MoveId.TORMENT, MoveId.SPLASH])
      .enemySpecies(SpeciesId.SHUCKLE)
      .enemyLevel(30)
      .moveset([MoveId.TACKLE])
      .ability(AbilityId.BALL_FETCH);
  });

  it("Pokemon should not be able to use the same move consecutively", async () => {
    await game.classicMode.startBattle(SpeciesId.CHANSEY);

    const playerPokemon = game.scene.getPlayerPokemon()!;

    // First turn, Player Pokemon uses Tackle successfully
    game.move.select(MoveId.TACKLE);
    await game.move.selectEnemyMove(MoveId.TORMENT);
    await game.toNextTurn();
    expect(playerPokemon).toHaveUsedMove(MoveId.TACKLE);
    expect(playerPokemon).toHaveMoveResult(MoveResult.SUCCESS);
    expect(playerPokemon?.getTag(BattlerTagType.TORMENT)).toBeDefined();

    // Second turn, Torment forces Struggle to occur
    game.move.select(MoveId.TACKLE);
    await game.move.selectEnemyMove(MoveId.SPLASH);
    await game.toNextTurn();
    expect(playerPokemon).toHaveUsedMove(MoveId.STRUGGLE);

    // Third turn, Tackle can be used.
    game.move.select(MoveId.TACKLE);
    await game.move.selectEnemyMove(MoveId.SPLASH);
    await game.phaseInterceptor.to("TurnEndPhase");
    expect(playerPokemon).toHaveUsedMove(MoveId.TACKLE);
  });
});
