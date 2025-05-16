import { PRIMAL_WEATHER_TYPES } from "#constants/weather-constants";
import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { WeatherType } from "#enums/weather-type";
import { GameManager } from "#test/test-utils/game-manager";
import { capitalizeString } from "#utils/string-utils";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

//#region Test Constants

const primalWeatherTypes = PRIMAL_WEATHER_TYPES.map((primalWeatherType) => ({
  primalWeatherName: capitalizeString(WeatherType[primalWeatherType], "_", false, true),
  primalWeatherType,
}));

//#endregion

describe("Ability - Drizzle", () => {
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
      .ability(AbilityId.DRIZZLE)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should cause rain weather", async () => {
    const { classicMode } = game;

    await classicMode.startBattle([SpeciesId.FEEBAS]);

    expect(game).toHaveWeather(WeatherType.RAIN);
  });

  it("should last the the rain for 5 turns", async () => {
    const { classicMode, move } = game;

    await classicMode.startBattle([SpeciesId.FEEBAS]);

    for (let i = 0; i < 5; i++) {
      expect(game).toHaveWeather(WeatherType.RAIN);

      move.use(MoveId.SPLASH);
      await game.toEndOfTurn();
    }

    expect(game).not.toHaveWeather(WeatherType.RAIN);
  });

  it.each(primalWeatherTypes)(
    "should not override primal $primalWeatherName weather",
    async ({ primalWeatherType }) => {
      const { phaseInterceptor, classicMode } = game;

      await classicMode.runToSummon([SpeciesId.FEEBAS]);
      game.scene.arena.trySetWeather(primalWeatherType, false);
      expect(game).toHaveWeather(primalWeatherType);

      await phaseInterceptor.to("PostSummonPhase");

      expect(game).not.toHaveWeather(WeatherType.RAIN);
    },
  );

  it.each([
    { weatherName: "Sunny", weatherType: WeatherType.SUNNY },
    { weatherName: "Sandstorm", weatherType: WeatherType.SANDSTORM },
    { weatherName: "Hail", weatherType: WeatherType.HAIL },
    { weatherName: "Snow", weatherType: WeatherType.SNOW },
    { weatherName: "Fog", weatherType: WeatherType.FOG },
  ])("should replace $weatherName weather", async ({ weatherType }) => {
    const { phaseInterceptor, classicMode } = game;

    await classicMode.runToSummon([SpeciesId.FEEBAS]);
    game.scene.arena.trySetWeather(weatherType, false);
    expect(game).toHaveWeather(weatherType);

    await phaseInterceptor.to("PostSummonPhase");

    expect(game).toHaveWeather(WeatherType.RAIN);
  });
});
