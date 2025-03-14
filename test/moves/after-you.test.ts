import { BattlerIndex } from "#enums/battler-index";
import { Abilities } from "#enums/abilities";
import { MoveResult } from "#enums/move-result";
import { MovePhase } from "#app/phases/move-phase";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - After You", () => {
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
      .battleType("double")
      .enemyLevel(5)
      .enemySpecies(Species.PIKACHU)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .ability(Abilities.BALL_FETCH)
      .moveset([MoveId.AFTER_YOU, MoveId.SPLASH]);
  });

  it("makes the target move immediately after the user", async () => {
    await game.classicMode.startBattle([Species.REGIELEKI, Species.SHUCKLE]);

    game.move.select(MoveId.AFTER_YOU, 0, BattlerIndex.PLAYER_2);
    game.move.select(MoveId.SPLASH, 1);

    await game.phaseInterceptor.to("MoveEffectPhase");
    await game.phaseInterceptor.to(MovePhase, false);
    const phase = game.scene.getCurrentPhase() as MovePhase;
    expect(phase.pokemon).toBe(game.scene.getPlayerField()[1]);
    await game.phaseInterceptor.to("MoveEndPhase");
  });

  it("fails if target already moved", async () => {
    game.override.enemySpecies(Species.SHUCKLE);
    await game.classicMode.startBattle([Species.REGIELEKI, Species.PIKACHU]);

    game.move.select(MoveId.SPLASH);
    game.move.select(MoveId.AFTER_YOU, 1, BattlerIndex.PLAYER);

    await game.phaseInterceptor.to("MoveEndPhase");
    await game.phaseInterceptor.to("MoveEndPhase");
    await game.phaseInterceptor.to(MovePhase);

    expect(game.scene.getPlayerField()[1].getLastXMoves(1)[0].result).toBe(MoveResult.FAIL);
  });
});
