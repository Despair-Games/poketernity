import { WEATHER_SUPPRESSING_ABILITIES } from "#constants/ability-constants";
import { PRIMAL_WEATHER_TYPES } from "#constants/weather-constants";
import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { WeatherType } from "#enums/weather-type";
import { GameManager } from "#test/test-utils/game-manager";
import { enumIdsToIdNameArray } from "#test/test-utils/test-utils";
import { t } from "i18next";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

//#region Test Constants

const primalWeather = enumIdsToIdNameArray(PRIMAL_WEATHER_TYPES, WeatherType);

const replaceableWeather = enumIdsToIdNameArray(
  [WeatherType.SUNNY, WeatherType.SANDSTORM, WeatherType.HAIL, WeatherType.SNOW, WeatherType.FOG],
  WeatherType,
);

const weatherSuppressingAbilities = enumIdsToIdNameArray(WEATHER_SUPPRESSING_ABILITIES, AbilityId);

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

  it.each(primalWeather)("should not override primal $name weather", async ({ id }) => {
    const { phaseInterceptor, classicMode } = game;

    await classicMode.runToSummon([SpeciesId.FEEBAS]);
    game.scene.arena.trySetWeather(id, false);
    expect(game).toHaveWeather(id);

    await phaseInterceptor.to("PostSummonPhase");

    expect(game).not.toHaveWeather(WeatherType.RAIN);
  });

  it.each(replaceableWeather)("should replace $name weather", async ({ id }) => {
    const { phaseInterceptor, classicMode } = game;

    await classicMode.runToSummon([SpeciesId.FEEBAS]);
    game.scene.arena.trySetWeather(id, false);
    expect(game).toHaveWeather(id);

    await phaseInterceptor.to("PostSummonPhase");

    expect(game).toHaveWeather(WeatherType.RAIN);
  });

  it.each(weatherSuppressingAbilities)(
    "should not be suppressed by $name ability and last the rain for 5 turns",
    async ({ id }) => {
      const { override, classicMode, move, textInterceptor } = game;
      override.enemyAbility(id);

      await classicMode.startBattle([SpeciesId.FEEBAS]);

      expect(textInterceptor.logs).toContain(t("abilityTriggers:weatherEffectDisappeared"));

      for (let i = 0; i < 5; i++) {
        expect(game).toHaveWeather(WeatherType.RAIN);

        move.use(MoveId.SPLASH);
        await game.toEndOfTurn();
      }

      expect(game).not.toHaveWeather(WeatherType.RAIN);
      console.log("NGJLFSLGBJFLSNGJLSG", enumIdsToIdNameArray([...WEATHER_SUPPRESSING_ABILITIES], AbilityId));
    },
  );
});
