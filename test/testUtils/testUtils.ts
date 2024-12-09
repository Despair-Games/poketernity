import i18next, { type ParseKeys } from "i18next";
import fs from "fs";
import path from "path";
import { vi } from "vitest";
import { SAVE_FILE_EXTENSION } from "#app/constants";

export const EVERYTHING_SAVE_FILE_PATH = `test/testUtils/saves/everything.${SAVE_FILE_EXTENSION}`;

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
 * Creates an array of range `start - end`
 *
 * @param start start number e.g. 1
 * @param end end number e.g. 10
 * @returns an array of numbers
 */
export function arrayOfRange(start: integer, end: integer) {
  return Array.from({ length: end - start }, (_v, k) => k + start);
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
