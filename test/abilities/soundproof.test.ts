import { allMoves } from "#app/data/data-lists";
import { AbilityId } from "#enums/ability-id";
import { MoveFlags } from "#enums/move-flags";
import { MoveId } from "#enums/move-id";
import { MoveResult } from "#enums/move-result";
import { SpeciesId } from "#enums/species-id";
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
      .ability(AbilityId.SOUNDPROOF)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("should not provide immunity to the ability holder's own sound moves", async () => {
    game.override.moveset(MoveId.CLANGOROUS_SOUL);
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);
    const playerPokemon = game.field.getPlayerPokemon();

    game.move.select(MoveId.CLANGOROUS_SOUL);
    await game.toEndOfTurn();

    const soundMove = allMoves.get(MoveId.CLANGOROUS_SOUL);

    expect(playerPokemon).toHaveMoveResult(MoveResult.SUCCESS);
    // @ts-expect-error - `hasFlag()` is private but we want to validate the flag is set
    expect(soundMove.hasFlag(MoveFlags.SOUND_MOVE)).toBe(true);
    expect(soundMove.checkFlag(MoveFlags.SOUND_MOVE, playerPokemon)).toBe(true);
  });
});
