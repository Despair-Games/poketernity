import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { Stat } from "#enums/stat";
import { WeatherType } from "#enums/weather-type";

describe("Abilities - Swift Swim", () => {
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
      .moveset([Moves.SPLASH])
      .ability(Abilities.SWIFT_SWIM)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(Moves.SPLASH);
  });

  it.each([
    { weatherType: WeatherType.RAIN, weatherName: "rain" },
    { weatherType: WeatherType.HEAVY_RAIN, weatherName: "heavy rain" },
  ])("should double the ability holder's speed in $weatherName", async ({ weatherType }) => {
    game.override.weather(weatherType);
    await game.classicMode.startBattle([Species.FEEBAS]);

    const pokemon = game.scene.getPlayerPokemon()!;
    vi.spyOn(pokemon, "getEffectiveStat");

    game.move.select(Moves.SPLASH);
    await game.phaseInterceptor.to("BerryPhase");

    expect(pokemon.getEffectiveStat).toHaveBeenLastCalledWith(Stat.SPD);
    expect(pokemon.getEffectiveStat).toHaveLastReturnedWith(pokemon.stats[Stat.SPD] * 2);
  });
});
