import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { allMoves } from "#app/data/all-moves";
import { MoveFlags } from "#enums/move-flags";

describe("Abilities - Sharpness", () => {
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
      .moveset([Moves.CUT])
      .ability(Abilities.SHARPNESS)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(Moves.SPLASH);
  });

  // Note: All affected moves have been verified to have the SLICING_MOVE flag by all_moves
  it("should boost the damage of a slicing move by a factor of 1.5", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);
    const playerPokemon = game.scene.getPlayerPokemon()!;
    const slicingMove = allMoves[Moves.CUT];
    vi.spyOn(slicingMove, "calculateBattlePower");

    game.move.select(Moves.CUT);
    await game.move.forceHit();
    await game.phaseInterceptor.to("BerryPhase");

    expect(slicingMove.checkFlag(MoveFlags.SLICING_MOVE, playerPokemon, null)).toBe(true);
    expect(slicingMove.calculateBattlePower).toHaveLastReturnedWith(slicingMove.power * 1.5);
  });
});
