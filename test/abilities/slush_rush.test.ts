import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { WeatherType } from "#enums/weather-type";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - Slush Rush", () => {
  // Note: The speed doubling properties of Slush Rush are tested in weather_based_speed_doubler.test.ts
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
      .weather(WeatherType.HAIL)
      .moveset([Moves.SPLASH])
      .ability(Abilities.SLUSH_RUSH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(Moves.SPLASH);
  });

  it("should not block damage from hail", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);
    const pokemon = game.scene.getPlayerPokemon();

    game.move.select(Moves.SPLASH);
    await game.phaseInterceptor.to("BerryPhase");

    expect(pokemon?.isFullHp()).toBe(false);
  });
});
