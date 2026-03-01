import { APP_ABBREVIATION, SAVE_FILE_EXTENSION } from "#constants/app-constants";
import type { Pokemon } from "#field/pokemon";
import type { GameManager } from "#test/test-utils/game-manager";
import fs from "node:fs";
import path from "node:path";
import i18next, { type ParseKeys } from "i18next";
import { vi } from "vitest";

// #region Types

type TypeOfResult = "undefined" | "object" | "boolean" | "number" | "bigint" | "string" | "symbol" | "function";

// #endregion
// #region Helpers

/**
 * @param received - The value to check
 * @returns Whether the input is a non-`null` {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object | object}
 */
function isObject(received: unknown): received is object {
  return received !== null && typeof received === "object";
}

// #endregion
// #region Constants

export const RESOURCES_FOLDER_PATH = "test/test-utils/resources";
export const EVERYTHING_SAVE_FILE_PATH = `${RESOURCES_FOLDER_PATH}/saves/everything.${APP_ABBREVIATION}.${SAVE_FILE_EXTENSION}`;

// #endregion
// #region Exports

/**
 * Mocks `i18next.t` to return the raw translation key that was passed in.
 * @example
 * ```ts
 * mockI18next();
 * console.log(i18next.t("menu:cancel")); // output: "menu:cancel"
 * ```
 * @returns A spy/mock of i18next
 */
export function mockI18next() {
  return (
    vi
      .spyOn(i18next, "t")
      // @ts-expect-error: mocking the type
      .mockImplementation((key: ParseKeys) => key)
  );
}

/**
 * @param start - Start number
 * @param end - End number
 * @returns An array of integers from `start` to `end` (inclusive)
 * @example
 * ```ts
 * console.log(arrayOfRange(1,3)); // output: "[1, 2, 3]"
 * ```
 */
export function arrayOfRange(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_v, k) => k + start);
}

/**
 * Utility to get the API base URL from the environment variable (or the default/fallback).
 * @returns the API base URL
 */
export function getApiBaseUrl(): string {
  return import.meta.env.VITE_SERVER_URL ?? "http://localhost:8001";
}

/**
 * @returns the path to the app's root directory
 */
export function getAppRootDir(): string {
  let currentDir = __dirname;
  while (!fs.existsSync(path.join(currentDir, "package.json"))) {
    currentDir = path.join(currentDir, "..");
  }
  return currentDir;
}

/**
 * Helper to determine the actual type of the received object as human readable string
 * @param received The received object
 * @returns A human readable string of the received object (type)
 */
export function receivedStr(received: unknown, expectedType: TypeOfResult = "object"): string {
  if (received === null) {
    return "null";
  }
  if (received === undefined) {
    return "undefined";
  }
  if (typeof received !== expectedType) {
    return typeof received;
  }
  if (expectedType === "object") {
    return received.constructor.name;
  }

  return "unknown";
}

/**
 * @param received - The value to check
 * @returns Whether the input is a {@linkcode Pokemon} instance
 */
export function isPokemonInstance(received: unknown): received is Pokemon {
  return isObject(received) && (received as Phaser.GameObjects.GameObject).type === "Pokemon";
}

/**
 * @param received - The value to check
 * @returns Whether the input is a {@linkcode GameManager} instance
 */
export function isGameManagerInstance(received: unknown): received is GameManager {
  return isObject(received) && (received as GameManager).constructor.name === "GameManager";
}

// #endregion
