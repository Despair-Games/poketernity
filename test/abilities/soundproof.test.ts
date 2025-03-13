import { allMoves } from "#app/data/data-lists";
import { Abilities } from "#enums/abilities";
import { MoveFlags } from "#enums/move-flags";
import { MoveResult } from "#enums/move-result";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - Soundproof", () => {
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
      .ability(Abilities.SOUNDPROOF)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("should not provide immunity to the ability holder's own sound moves", async () => {
    game.override.moveset(MoveId.CLANGOROUS_SOUL);
    await game.classicMode.startBattle([Species.FEEBAS]);
    const playerPokemon = game.scene.getPlayerPokemon()!;

    game.move.select(MoveId.CLANGOROUS_SOUL);
    await game.toEndOfTurn();

    const soundMove = allMoves.get(MoveId.CLANGOROUS_SOUL);
    const lastMove = playerPokemon.getLastXMoves()[0];

    expect(lastMove.result).toBe(MoveResult.SUCCESS);
    expect(soundMove.checkFlag(MoveFlags.SOUND_MOVE, playerPokemon, null)).toBe(true);
  });
});
