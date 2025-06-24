import { APP_ABBREVIATION, SAVE_FILE_EXTENSION } from "#constants/app-constants";
import type { Pokemon } from "#field/pokemon";
import type { GameManager } from "#test/test-utils/game-manager";
import i18next, { type ParseKeys } from "i18next";
import fs from "node:fs";
import path from "node:path";
import { vi } from "vitest";

//#region Types

type TypeOfResult = "undefined" | "object" | "boolean" | "number" | "bigint" | "string" | "symbol" | "function";

//#endregion
//#region Constants

export const RESOURCES_FOLDER_PATH = "test/test-utils/resources";
export const EVERYTHING_SAVE_FILE_PATH = `${RESOURCES_FOLDER_PATH}/saves/everything.${APP_ABBREVIATION}.${SAVE_FILE_EXTENSION}`;

//#endregion

/**
 * Sets up the i18next mock.
 * Includes a i18next.t mocked implementation only returning the raw key (`(key) => key`)
 *
 * @returns A spy/mock of i18next
 */
export function mockI18next() {
  return vi.spyOn(i18next, "t").mockImplementation((key: ParseKeys) => key);
}

/**
 * Creates an array of range `start - end` (inclusive).
 *
 * @param start start number e.g. 1
 * @param end end number e.g. 10
 * @returns an array from start to end (inclusive)
 */
export function arrayOfRange(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_v, k) => k + start);
}

/**
 * Utility to get the API base URL from the environment variable (or the default/fallback).
 * @returns the API base URL
 */
export function getApiBaseUrl() {
  return import.meta.env.VITE_SERVER_URL ?? "http://localhost:8001";
}

/**
 * @returns the path to the app's root directory
 */
export function getAppRootDir() {
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
 * Checks if the received object is an {@linkcode Object}
 * @param received - The object to check
 * @returns Whether the object is an {@linkcode Object}
 */
export function isObject(received: unknown): received is object {
  return !!received && typeof received === "object";
}

/**
 * Checks if an object is a {@linkcode Pokemon} instance
 * @param received - The object to check
 * @returns Whether the object is a {@linkcode Pokemon} instance
 */
export function isPokemonInstance(received: unknown): received is Pokemon {
  return isObject(received) && (received as Phaser.GameObjects.GameObject).type === "Pokemon";
}

/**
 * Checks if an object is a {@linkcode GameManager} instance
 * @param received - The object to check
 * @returns Whether the object is a Pokemon instance
 */
export function isGameManagerInstance(received: unknown): received is GameManager {
  return isObject(received) && (received as GameManager).constructor.name === "GameManager";
}
