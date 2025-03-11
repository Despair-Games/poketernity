import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { allMoves } from "#app/data/data-lists";
import { MoveFlags } from "#enums/move-flags";
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
      .ability(Abilities.MEGA_LAUNCHER)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("should boost the healing of Heal Pulse to 75% of the target's maximum HP", async () => {
    game.override.moveset(MoveId.HEAL_PULSE);
    await game.classicMode.startBattle([Species.FEEBAS]);
    const playerPokemon = game.scene.getPlayerPokemon()!;
    const enemyPokemon = game.scene.getEnemyPokemon()!;
    const enemyHpRecovered = Math.floor(enemyPokemon.hp * 0.75);
    enemyPokemon.hp = 1;
    const pulseMove = allMoves.get(MoveId.HEAL_PULSE);
    game.move.select(MoveId.HEAL_PULSE);
    await game.toEndOfTurn();

    expect(pulseMove.checkFlag(MoveFlags.PULSE_MOVE, playerPokemon, null)).toBe(true);
    expect(enemyPokemon.hp - 1).toBe(enemyHpRecovered);
  });
});
