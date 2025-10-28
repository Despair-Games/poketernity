import { WEATHER_SUPPRESSING_ABILITIES } from "#constants/ability-constants";
import { PRIMAL_WEATHER_TYPES } from "#constants/weather-constants";
import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { WeatherType } from "#enums/weather-type";
import { GameManager } from "#test/test-utils/game-manager";
import { enumValueToKey } from "#utils/common-utils";
import { capitalizeString } from "#utils/string-utils";
import { t } from "i18next";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

//#region Test Constants

const primalWeather = PRIMAL_WEATHER_TYPES.map<[string, WeatherType]>((weatherType) => [
  capitalizeString(enumValueToKey(WeatherType, weatherType), "_", false, true) ?? "",
  weatherType,
]);

const replaceableWeather = [
  WeatherType.SUNNY,
  WeatherType.SANDSTORM,
  WeatherType.HAIL,
  WeatherType.SNOW,
  WeatherType.FOG,
].map<[string, WeatherType]>((weatherType) => [
  capitalizeString(enumValueToKey(WeatherType, weatherType), "_", false, true) ?? "",
  weatherType,
]);

const weatherSuppressingAbilities = WEATHER_SUPPRESSING_ABILITIES.map<[string, AbilityId]>((abilityId) => [
  capitalizeString(AbilityId[abilityId], "_", false, true) ?? "",
  abilityId,
]);

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

  it("should last the rain for 5 turns", async () => {
    const { classicMode, move } = game;

    await classicMode.startBattle(SpeciesId.FEEBAS);

    for (let i = 0; i < 5; i++) {
      expect(game).toHaveWeather(WeatherType.RAIN);

      move.use(MoveId.SPLASH);
      await game.toEndOfTurn();
    }

    expect(game).not.toHaveWeather(WeatherType.RAIN);
  });

  it.each(primalWeather)("should not override primal %s weather", async (_name, weatherType) => {
    const { phaseInterceptor, classicMode } = game;

    await classicMode.runToSummon(SpeciesId.FEEBAS);
    game.scene.arena.trySetWeather(weatherType, false);
    expect(game).toHaveWeather(weatherType);

    await phaseInterceptor.to("CommandPhase");

    expect(game).not.toHaveWeather(WeatherType.RAIN);
  });

  it.each(replaceableWeather)("should replace %s weather", async (_name, weatherType) => {
    const { phaseInterceptor, classicMode } = game;

    await classicMode.runToSummon(SpeciesId.FEEBAS);
    game.scene.arena.trySetWeather(weatherType, false);
    expect(game).toHaveWeather(weatherType);

    await phaseInterceptor.to("CommandPhase");

    expect(game).toHaveWeather(WeatherType.RAIN);
  });

  it.each(weatherSuppressingAbilities)(
    "should not be stopped from setting weather by %s ability",
    async (_name, abilityId) => {
      const { override, classicMode, move, textInterceptor } = game;
      override.enemyAbility(abilityId);

      await classicMode.startBattle(SpeciesId.FEEBAS);

      expect(textInterceptor.logs).toContain(t("abilityTriggers:weatherEffectDisappeared"));

      for (let i = 0; i < 5; i++) {
        expect(game).toHaveWeather(WeatherType.RAIN);

        move.use(MoveId.SPLASH);
        await game.toEndOfTurn();
      }

      expect(game).not.toHaveWeather(WeatherType.RAIN);
    },
  );
});
