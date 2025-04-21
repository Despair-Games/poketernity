import { capitalizeString } from "#app/utils";
import { WeatherType } from "#enums/weather-type";
import type { GameManager } from "#test/test-utils/gameManager";

/**
 * Matcher to check if the {@linkcode WeatherType} is as expected
 * @param received The object to check. Expects an instance of {@linkcode GameManager}.
 * @param expectedWeatherType The expected {@linkcode WeatherType}
 * @returns Whether the matcher passed
 */
export function toHaveWeatherMatcher(received: unknown, expectedWeatherType: WeatherType) {
  if (typeof received !== "object" || received === null || (received as object).constructor.name !== "GameManager") {
    return {
      pass: false,
      message: () => `Expected GameManager object, but got ${toActualStr(received)}!`,
    };
  }

  const gameManager = received as GameManager;

  if (!gameManager.scene) {
    return {
      pass: false,
      message: () => `Expected GameManager.scene to be defined!`,
    };
  }

  if (!gameManager.scene.arena) {
    return {
      pass: false,
      message: () => `Expected GameManager.scene.arena to be defined!`,
    };
  }

  const pass = gameManager.scene.arena.hasWeather(expectedWeatherType);
  const weatherStr = toWeatherStr(expectedWeatherType);
  const actualWeatherStr = toWeatherStr(gameManager.scene.arena.weather?.weatherType);

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
 * Get a readable string of the WeatherType
 * @param weatherType The {@linkcode WeatherType} to transform
 * @returns A readable string
 */
function toWeatherStr(weatherType?: WeatherType) {
  if (!weatherType) {
    return "undefined";
  } else {
    return capitalizeString(WeatherType[weatherType], "_", false, true);
  }
}

/**
 * Get a readable string of the received value
 * @param received The received "unknown" to check
 * @returns A readable string
 */
function toActualStr(received: unknown) {
  let actual = "unknown";
  if (received === null) {
    actual = "null";
  } else if ((received as any).constructor?.name) {
    actual = (received as object).constructor.name ?? "Unknown";
  } else if (typeof received) {
    actual = typeof received;
  }

  return actual;
}

//#endregion
