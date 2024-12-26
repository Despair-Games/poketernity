import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { WeatherType } from "#enums/weather-type";
import { Stat } from "#enums/stat";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Abilities - Sand Rush", () => {
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
      .weather(WeatherType.SANDSTORM)
      .moveset([Moves.SPLASH])
      .ability(Abilities.SAND_RUSH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(Moves.SPLASH);
  });

  it("should double the ability holder's speed during a sandstorm", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const pokemon = game.scene.getPlayerPokemon()!;
    vi.spyOn(pokemon, "getEffectiveStat");

    game.move.select(Moves.SPLASH);
    await game.phaseInterceptor.to("BerryPhase");

    expect(pokemon.getEffectiveStat).toHaveBeenLastCalledWith(Stat.SPD);
    expect(pokemon.getEffectiveStat).toHaveLastReturnedWith(pokemon.stats[Stat.SPD] * 2);
  });
});
