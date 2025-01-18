import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { allMoves } from "#app/data/all-moves";
import { MoveFlags } from "#enums/move-flags";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { HealAttr } from "#app/data/move-attrs/heal-attr";

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
      .enemyMoveset(Moves.SPLASH);
  });

  it("should boost the healing of Heal Pulse to 75% of the target's maximum HP", async () => {
    game.override.moveset(Moves.HEAL_PULSE);
    await game.classicMode.startBattle([Species.FEEBAS]);
    const playerPokemon = game.scene.getPlayerPokemon()!;
    const pulseMove = allMoves[Moves.HEAL_PULSE];
    const healAttr = pulseMove.getAttrs(HealAttr)[0];

    vi.spyOn(healAttr, "getHealRatio");

    game.move.select(Moves.HEAL_PULSE);
    await game.phaseInterceptor.to("BerryPhase");

    expect(pulseMove.checkFlag(MoveFlags.PULSE_MOVE, playerPokemon, null)).toBe(true);
    expect(healAttr.getHealRatio).toHaveLastReturnedWith(0.75);
  });
});
