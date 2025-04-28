import { BattlerIndex } from "#enums/battler-index";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Flinch", () => {
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
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyMoveset(MoveId.FAKE_OUT)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should stay flinched if moving twice in a turn", async () => {
    const { override, classicMode, move, phaseInterceptor } = game;

    override.battleType("double").moveset([MoveId.SPLASH, MoveId.INSTRUCT, MoveId.AERIAL_ACE]);

    await classicMode.startBattle([SpeciesId.FEEBAS, SpeciesId.SQUIRTLE]);

    const player1 = game.scene.getPlayerPokemon()!;

    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.ENEMY_2, BattlerIndex.PLAYER, BattlerIndex.PLAYER_2]);
    move.select(MoveId.AERIAL_ACE, BattlerIndex.PLAYER);
    move.select(MoveId.INSTRUCT, BattlerIndex.PLAYER_2, BattlerIndex.PLAYER);
    await move.forceEnemyMove(MoveId.FAKE_OUT, BattlerIndex.PLAYER);
    await move.forceEnemyMove(MoveId.SPLASH);

    expect(player1).not.toHaveFlinched();

    await phaseInterceptor.to("MoveEndPhase", true);
    await phaseInterceptor.to("MoveEndPhase", true);

    expect(player1).toHaveFlinched();

    await phaseInterceptor.to("MoveEndPhase", true);

    expect(player1).toHaveFlinched();
    await game.toEndOfTurn();

    expect(player1).not.toHaveFlinched(); // tag was lapsed
  });
});
