import { WeatherType } from "#enums/weather-type";
import { isGameManagerInstance, receivedStr } from "#test/test-utils/test-utils";
import { capitalizeString } from "#utils/string-utils";
import type { MatcherState, SyncExpectationResult } from "@vitest/expect";

/**
 * Matcher to check if the {@linkcode WeatherType} is as expected
 * @param received - The object to check. Expects an instance of {@linkcode GameManager}.
 * @param expectedWeatherType - The expected {@linkcode WeatherType}
 * @returns Whether the matcher passed
 */
export function toHaveWeatherMatcher(
  this: MatcherState,
  received: unknown,
  expectedWeatherType: WeatherType,
): SyncExpectationResult {
  if (!isGameManagerInstance(received)) {
    return {
      pass: this.isNot,
      message: () => `Expected GameManager, but got ${receivedStr(received)}!`,
    };
  }

  if (!received.scene?.arena) {
    return {
      pass: this.isNot,
      message: () => `Expected GameManager.${received.scene ? "scene" : "scene.arena"} to be defined!`,
    };
  }

  const pass = received.scene.arena.hasWeather(expectedWeatherType);

  const weatherStr = toWeatherStr(expectedWeatherType);
  const actualWeatherStr = toWeatherStr(received.scene.arena.weatherType);

  return {
    pass,
    message: () =>
      pass
        ? `Expected Arena to NOT have weather ${weatherStr}, but it did.`
        : `Expected Arena to have weather ${weatherStr}, but got ${actualWeatherStr}`,
  };
}

//#region Helpers

/**
 * Get a human readable string of the WeatherType
 * @param weatherType - The {@linkcode WeatherType} to transform
 * @returns A human readable string
 */
function toWeatherStr(weatherType: WeatherType) {
  return capitalizeString(WeatherType[weatherType], "_", false, true);
}

//#endregion
