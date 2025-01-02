import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
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
    game.overridesHelper
      .ability(Abilities.COMPOUND_EYES)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(Moves.SPLASH);
  });

  it("should multiply the accuracy of a move by 1.3", async () => {
    game.overridesHelper.moveset(Moves.HYPNOSIS);
    await game.classicModeHelper.startBattle([Species.FEEBAS]);
    const pokemon = game.scene.getPlayerPokemon()!;
    vi.spyOn(pokemon, "getAccuracyMultiplier");

    game.moveHelper.select(Moves.HYPNOSIS);
    await game.phaseInterceptor.to("BerryPhase");

    expect(pokemon.getAccuracyMultiplier).toHaveLastReturnedWith(1.3);
  });

  it("should not affect the accuracy of one-hit KO moves", async () => {
    game.overridesHelper.moveset(Moves.SHEER_COLD);
    await game.classicModeHelper.startBattle([Species.FEEBAS]);
    const pokemon = game.scene.getPlayerPokemon()!;
    vi.spyOn(pokemon, "getAccuracyMultiplier");

    game.moveHelper.select(Moves.SHEER_COLD);
    await game.phaseInterceptor.to("BerryPhase");

    expect(pokemon.getAccuracyMultiplier).toHaveLastReturnedWith(1);
  });
});
