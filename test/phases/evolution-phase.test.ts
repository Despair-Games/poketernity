import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { Button } from "#enums/buttons";
import { type EvolutionPhase } from "#app/phases/evolution-phase";
import { UiMode } from "#enums/ui-mode";

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
      .enemyMoveset(MoveId.SPLASH);
  });

  it("should evolve the Pokemon by exactly 1 stage", async () => {
    await game.classicMode.startBattle([Species.BULBASAUR]);

    const pokemon = game.field.getPlayerPokemon();
    expect(pokemon.species.getName()).toBe("Bulbasaur");
    expect(pokemon.calculateBaseStats()).toStrictEqual([45, 49, 49, 65, 65, 45]);

    vi.spyOn(pokemon, "getLevelMoves").mockReturnValue([]); // Do not attempt to learn level-up moves

    game.move.use(MoveId.SPLASH);
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

    game.move.use(MoveId.SPLASH);
    await game.doKillOpponents();

    // Repeatedly press "Cancel" to cancel evolution and say "No" to pausing evolutions
    const pressCancelInterval = setInterval(() => game.scene.ui.processInput(Button.CANCEL));

    await game.toNextWave();
    clearInterval(pressCancelInterval);

    expect(pokemon.level).toBeGreaterThan(32);
    expect(pokemon.species.getName()).toBe("Bulbasaur");
    expect(pokemon.calculateBaseStats()).toStrictEqual([45, 49, 49, 65, 65, 45]);
  });

  it("should allow to pause evolutions after cancelling them", async () => {
    await game.classicMode.startBattle([Species.BULBASAUR]);

    const pokemon = game.field.getPlayerPokemon();
    expect(pokemon.species.getName()).toBe("Bulbasaur");
    expect(pokemon.calculateBaseStats()).toStrictEqual([45, 49, 49, 65, 65, 45]);
    expect(pokemon.pauseEvolutions).toBeFalsy();

    vi.spyOn(pokemon, "getLevelMoves").mockReturnValue([]); // Do not attempt to learn level-up moves

    game.move.use(MoveId.SPLASH);
    await game.doKillOpponents();
    await game.phaseInterceptor.to("EvolutionPhase", false);

    // Cancel the evolution
    (game.scene.getCurrentPhase() as EvolutionPhase).cancelEvolution();

    // Say yes to pausing the evolution
    game.onNextPrompt("EvolutionPhase", UiMode.CONFIRM, () => game.scene.ui.processInput(Button.ACTION));
    await game.toNextWave();

    const lastLevel = pokemon.level;
    expect(pokemon.pauseEvolutions).toBeTruthy();
    expect(lastLevel).toBeGreaterThan(32);
    expect(pokemon.species.getName()).toBe("Bulbasaur");
    expect(pokemon.calculateBaseStats()).toStrictEqual([45, 49, 49, 65, 65, 45]);

    game.move.use(MoveId.SPLASH);
    await game.doKillOpponents();
    await game.toNextWave();

    // Should not have a second EvolutionPhase after pausing
    expect(game.phaseInterceptor.log.filter((phase) => phase === "EvolutionPhase").length).toBe(1);
    expect(pokemon.level).toBeGreaterThan(lastLevel);
    expect(pokemon.species.getName()).toBe("Bulbasaur");
    expect(pokemon.calculateBaseStats()).toStrictEqual([45, 49, 49, 65, 65, 45]);
  });
});
