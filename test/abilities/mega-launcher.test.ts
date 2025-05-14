import { allMoves } from "#data/data-lists";
import { AbilityId } from "#enums/ability-id";
import { MoveFlags } from "#enums/move-flags";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - Mega Launcher", () => {
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
      .ability(AbilityId.MEGA_LAUNCHER)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("should boost the healing of Heal Pulse to 75% of the target's maximum HP", async () => {
    game.override.moveset(MoveId.HEAL_PULSE);
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);
    const playerPokemon = game.field.getPlayerPokemon();
    const enemyPokemon = game.field.getEnemyPokemon();
    const enemyHpRecovered = Math.floor(enemyPokemon.hp * 0.75);
    enemyPokemon.hp = 1;
    const pulseMove = allMoves.get(MoveId.HEAL_PULSE);
    game.move.select(MoveId.HEAL_PULSE);
    await game.toEndOfTurn();

    // @ts-expect-error - `hasFlag()` is private but we want to validate the flag is set
    expect(pulseMove.hasFlag(MoveFlags.PULSE_MOVE)).toBe(true);
    expect(pulseMove.checkFlag(MoveFlags.PULSE_MOVE, playerPokemon)).toBe(true);
    expect(enemyPokemon.hp - 1).toBe(enemyHpRecovered);
  });
});
