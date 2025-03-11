import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { WeatherType } from "#enums/weather-type";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Primal Weather", () => {
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
      .battleType("single")
      .ability(Abilities.BALL_FETCH)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemySpecies(Species.MAGIKARP)
      .enemyMoveset(MoveId.SPLASH);
  });

  it.each([
    { weatherName: "Harsh Sun", ability: Abilities.DESOLATE_LAND, weatherType: WeatherType.HARSH_SUN },
    { weatherName: "Heavy Rain", ability: Abilities.PRIMORDIAL_SEA, weatherType: WeatherType.HEAVY_RAIN },
    { weatherName: "Strong Winds", ability: Abilities.DELTA_STREAM, weatherType: WeatherType.STRONG_WINDS },
  ])("$weatherName can't be overwritten by non-primal weather", async ({ ability, weatherType }) => {
    game.override.ability(ability);
    await game.classicMode.startBattle([Species.FEEBAS]);

    game.move.use(MoveId.SANDSTORM);
    await game.toEndOfTurn();

    expect(game.scene.arena.hasWeather(weatherType)).toBe(true);
  });
});
