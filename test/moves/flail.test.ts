import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, it, expect, vi } from "vitest";
import { MoveEffectPhase } from "#app/phases/move-effect-phase";
import { DamageAnimPhase } from "#app/phases/damage-anim-phase";
import { allMoves } from "#app/data/all-moves";
import type { Move } from "#app/data/move";

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
    flail = allMoves[MoveId.FLAIL];
    game.override
      .moveset(MoveId.FLAIL)
      .battleType("single")
      .startingLevel(100)
      .enemySpecies(Species.SNORLAX)
      .enemyLevel(100)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
    vi.spyOn(flail, "calculateBattlePower");
  });

  it.each([
    { hpRatio: 1, expectedBp: 200 },
    { hpRatio: 4, expectedBp: 150 },
    { hpRatio: 9, expectedBp: 100 },
    { hpRatio: 16, expectedBp: 80 },
    { hpRatio: 32, expectedBp: 40 },
    { hpRatio: 48, expectedBp: 20 },
  ])("should have $expectedBp base power at ($hpRatio / 48) health", async ({ hpRatio, expectedBp }) => {
    await game.classicMode.startBattle([Species.BLISSEY]);

    const playerPokemon = game.scene.getPlayerPokemon()!;
    playerPokemon.hp = (playerPokemon.hp * hpRatio) / 48;

    game.move.select(MoveId.FLAIL, 0);

    await game.phaseInterceptor.to(MoveEffectPhase, false);
    expect((game.scene.getCurrentPhase() as MoveEffectPhase).move.moveId).toBe(flail.id);
    await game.phaseInterceptor.to(DamageAnimPhase, false);
    expect(flail.calculateBattlePower).toHaveLastReturnedWith(expectedBp);
  });
});
