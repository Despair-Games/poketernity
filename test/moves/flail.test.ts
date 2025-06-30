import { allMoves } from "#data/data-lists";
import { AbilityId } from "#enums/ability-id";
import { BattlerIndex } from "#enums/battler-index";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import type { Move } from "#moves/move";
import type { MoveEffectPhase } from "#phases/move-effect-phase";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Moves - Flail", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;
  let flail: Move;

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
    flail = allMoves.get(MoveId.FLAIL);
    game.override
      .moveset(MoveId.FLAIL)
      .battleType("single")
      .startingLevel(100)
      .enemySpecies(SpeciesId.SNORLAX)
      .enemyLevel(100)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
    vi.spyOn(flail, "calculateBattlePower");
  });

  it.each([
    { hpRatio: 0.1, expectedBp: 200 },
    { hpRatio: 1.9, expectedBp: 200 },
    { hpRatio: 2, expectedBp: 150 },
    { hpRatio: 4.9, expectedBp: 150 },
    { hpRatio: 5, expectedBp: 100 },
    { hpRatio: 9.9, expectedBp: 100 },
    { hpRatio: 10, expectedBp: 80 },
    { hpRatio: 16.9, expectedBp: 80 },
    { hpRatio: 17, expectedBp: 40 },
    { hpRatio: 32.9, expectedBp: 40 },
    { hpRatio: 33, expectedBp: 20 },
    { hpRatio: 48, expectedBp: 20 },
  ])("should have $expectedBp base power at ($hpRatio / 48) health", async ({ hpRatio, expectedBp }) => {
    await game.classicMode.startBattle(SpeciesId.BLISSEY);

    const playerPokemon = game.scene.getPlayerPokemon()!;
    vi.spyOn(playerPokemon, "getMaxHp").mockReturnValue(480);
    playerPokemon.hp = 10 * hpRatio;

    game.move.select(MoveId.FLAIL, 0);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);

    await game.phaseInterceptor.to("MoveEffectPhase", false);
    expect((game.scene.phaseManager.getCurrentPhase() as MoveEffectPhase).move.moveId).toBe(flail.id);
    await game.phaseInterceptor.to("DamageAnimPhase", false);
    expect(flail.calculateBattlePower).toHaveLastReturnedWith(expectedBp);
  });
});
