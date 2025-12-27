import { WeatherType } from "#enums/weather-type";
import { getEnumStr } from "#test/test-utils/string-utils";
import { isGameManagerInstance, receivedStr } from "#test/test-utils/test-utils";
import type { MatcherState, SyncExpectationResult } from "@vitest/expect";

/**
 * Matcher that checks if the current weather is as expected.
 * @param received - The object to check. Should be the current {@linkcode GameManager}
 * @param expected - The expected {@linkcode WeatherType}
 * @returns Whether the matcher passed
 */
export function toHaveWeather(
  this: Readonly<MatcherState>,
  received: unknown,
  expected: WeatherType,
): SyncExpectationResult {
  if (!isGameManagerInstance(received)) {
    return {
      pass: this.isNot,
      message: () => `Expected to receive a GameManager, but got ${receivedStr(received)}!`,
    };
  }

  if (!received.scene?.arena) {
    return {
      pass: this.isNot,
      message: () => `Expected GameManager.${received.scene ? "scene.arena" : "scene"} to be defined!`,
    };
  }

  const actual = received.scene.arena.weatherType;
  const pass = actual === expected;
  const actualStr = toWeatherStr(actual);
  const expectedStr = toWeatherStr(expected);

  return {
    pass,
    message: () =>
      pass
        ? `Expected the Arena to NOT have ${expectedStr} active, but it did!`
        : `Expected the Arena to have ${expectedStr} active, but got ${actualStr} instead!`,
    expected,
    actual,
  };
}

//#region Helpers

/**
 * Get a human readable representation of the current weather.
 * @param weatherType - The {@linkcode WeatherType} to transform
 * @returns A human readable string
 */
function toWeatherStr(weatherType: WeatherType) {
  if (weatherType === WeatherType.NONE) {
    return "no weather";
  }

  return getEnumStr(WeatherType, weatherType, { casing: "Title", suffix: " Weather" });
}

//#endregion
