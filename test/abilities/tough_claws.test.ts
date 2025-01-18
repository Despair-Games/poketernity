import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { allMoves } from "#app/data/all-moves";
import { MoveFlags } from "#enums/move-flags";

describe("Abilities - Tough Claws", () => {
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
      .moveset([Moves.TACKLE])
      .ability(Abilities.TOUGH_CLAWS)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(Moves.SPLASH);
  });

  // Note: All affected moves have been verified to have the MAKES_CONTACT flag by all_moves
  it("should boost the damage of a slicing move by a factor of 1.3", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);
    const playerPokemon = game.scene.getPlayerPokemon()!;
    const contactMove = allMoves[Moves.TACKLE];
    vi.spyOn(contactMove, "calculateBattlePower");

    game.move.select(Moves.TACKLE);
    await game.move.forceHit();
    await game.phaseInterceptor.to("BerryPhase");

    expect(contactMove.checkFlag(MoveFlags.MAKES_CONTACT, playerPokemon, null)).toBe(true);
    expect(contactMove.calculateBattlePower).toHaveLastReturnedWith(contactMove.power * 1.3);
  });
});
