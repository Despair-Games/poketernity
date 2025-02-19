import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Abilities - Compound Eyes", () => {
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
      .ability(Abilities.COMPOUND_EYES)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("should multiply the accuracy of a move by 1.3", async () => {
    game.override.moveset(MoveId.HYPNOSIS);
    await game.classicMode.startBattle([Species.FEEBAS]);
    const pokemon = game.scene.getPlayerPokemon()!;
    vi.spyOn(pokemon, "getAccuracyMultiplier");

    game.move.select(MoveId.HYPNOSIS);
    await game.toEndOfTurn();

    expect(pokemon.getAccuracyMultiplier).toHaveLastReturnedWith(1.3);
  });

  it("should not affect the accuracy of one-hit KO moves", async () => {
    game.override.moveset(MoveId.SHEER_COLD);
    await game.classicMode.startBattle([Species.FEEBAS]);
    const pokemon = game.scene.getPlayerPokemon()!;
    vi.spyOn(pokemon, "getAccuracyMultiplier");

    game.move.select(MoveId.SHEER_COLD);
    await game.toEndOfTurn();

    expect(pokemon.getAccuracyMultiplier).toHaveLastReturnedWith(1);
  });
});
