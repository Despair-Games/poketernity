import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { allMoves } from "#app/data/all-moves";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { MoveFlags } from "#enums/move-flags";

describe("Abilities - Iron Fist", () => {
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
      .moveset([Moves.FIRE_PUNCH])
      .ability(Abilities.IRON_FIST)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(Moves.SPLASH);
  });

  // Note: All affected moves have been verified to have the PUNCHING_MOVE flag by all_moves
  it("should boost the damage of a punching move by a factor of 1.2", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);
    const playerPokemon = game.scene.getPlayerPokemon()!;
    const punchingMove = allMoves[Moves.FIRE_PUNCH];
    vi.spyOn(punchingMove, "calculateBattlePower");

    game.move.select(Moves.FIRE_PUNCH);
    await game.move.forceHit();
    await game.phaseInterceptor.to("BerryPhase");

    expect(punchingMove.checkFlag(MoveFlags.PUNCHING_MOVE, playerPokemon, null)).toBe(true);
    expect(punchingMove.calculateBattlePower).toHaveLastReturnedWith(punchingMove.power * 1.2);
  });
});
