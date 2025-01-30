import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { Button } from "#enums/buttons";

describe("Evolution Phase", () => {
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
      .startingWave(100) // Make sure level cap is high enough for evolution
      .ability(Abilities.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemyLevel(1000)
      .enemySpecies(Species.BLISSEY)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(Moves.SPLASH);
  });

  it("should evolve the Pokemon by exactly 1 stage", async () => {
    await game.classicMode.startBattle([Species.BULBASAUR]);

    const pokemon = game.field.getPlayerPokemon();
    expect(pokemon.species.getName()).toBe("Bulbasaur");
    expect(pokemon.calculateBaseStats()).toStrictEqual([45, 49, 49, 65, 65, 45]);

    vi.spyOn(pokemon, "getLevelMoves").mockReturnValue([]); // Do not attempt to learn level-up moves

    game.move.use(Moves.SPLASH);
    await game.doKillOpponents();
    await game.toNextWave();

    expect(pokemon.level).toBeGreaterThan(32);
    expect(pokemon.species.getName()).toBe("Ivysaur");
    expect(pokemon.calculateBaseStats()).toStrictEqual([60, 62, 63, 80, 80, 60]);
  });

  it("should be cancellable", async () => {
    await game.classicMode.startBattle([Species.BULBASAUR]);

    const pokemon = game.field.getPlayerPokemon();
    expect(pokemon.species.getName()).toBe("Bulbasaur");
    expect(pokemon.calculateBaseStats()).toStrictEqual([45, 49, 49, 65, 65, 45]);

    vi.spyOn(pokemon, "getLevelMoves").mockReturnValue([]); // Do not attempt to learn level-up moves

    // Prevent evolution from finishing instantly, so that the player can attempt to cancel it
    const originalDoCycle = game.scene.animations.doCycle;
    vi.spyOn(game.scene.animations, "doCycle").mockImplementation(async (...args) => {
      await new Promise<void>((resolve) => setTimeout(resolve));
      return originalDoCycle.apply(game.scene.animations, args);
    });

    game.move.use(Moves.SPLASH);
    await game.doKillOpponents();

    // Repeatedly press "Cancel" to cancel evolution and say "No" to pausing evolutions
    const pressCancelInterval = setInterval(() => game.scene.ui.processInput(Button.CANCEL));

    await game.toNextWave();
    clearInterval(pressCancelInterval);

    expect(pokemon.level).toBeGreaterThan(32);
    expect(pokemon.species.getName()).toBe("Bulbasaur");
    expect(pokemon.calculateBaseStats()).toStrictEqual([45, 49, 49, 65, 65, 45]);
  });
});
