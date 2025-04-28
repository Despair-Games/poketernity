// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { initGameSpeed } from "#app/system/game-speed";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

import type { Pokemon } from "#app/field/pokemon";
import { supportedLanguages } from "#app/system/settings/supported-languages";
import { randSeedInt } from "#app/utils/random-utils";

export type nil = null | undefined;

export const MissingTextureKey = "__MISSING";

export function getFrameMs(frameCount: number): number {
  return Math.floor((1 / 60) * 1000 * frameCount);
}

export function getCurrentTime(): number {
  const date = new Date();
  return ((date.getHours() * 60 + date.getMinutes()) / 1440 + 0.675) % 1;
}

/**
 * Generates IVs from a given {@linkcode id} by extracting 5 bits at a time
 * starting from the least significant bit up to the 30th most significant bit.
 * @param id 32-bit number
 * @returns An array of six numbers corresponding to 5-bit chunks from {@linkcode id}
 */
export function getIvsFromId(id?: number): number[] {
  if (isNullOrUndefined(id)) {
    id = randSeedInt(4294967296);
  }
  return [
    (id & 0x3e000000) >>> 25,
    (id & 0x01f00000) >>> 20,
    (id & 0x000f8000) >>> 15,
    (id & 0x00007c00) >>> 10,
    (id & 0x000003e0) >>> 5,
    id & 0x0000001f,
  ];
}

export function getEnumKeys(enumType: any): string[] {
  return Object.values(enumType)
    .filter((v) => isNaN(parseInt(v!.toString())))
    .map((v) => v!.toString());
}

export function getEnumValues(enumType: any): number[] {
  return Object.values(enumType)
    .filter((v) => !isNaN(parseInt(v!.toString())))
    .map((v) => parseInt(v!.toString()));
}

/**
 * Utils to retrieve the length of an enum
 * @param theEnum the enum to get the length of
 * @returns length of the enum
 */
export function getEnumLength(theEnum: any): number {
  return getEnumKeys(theEnum).length;
}

export function executeIf<T>(condition: boolean, promiseFunc: () => Promise<T>): Promise<T | null> {
  return condition ? promiseFunc() : new Promise<T | null>((resolve) => resolve(null));
}

/**
 * @deprecated Refer to [api.ts](./plugins/api/api.ts) instead
 */
export const localServerUrl =
  import.meta.env.VITE_SERVER_URL ?? `http://${window.location.hostname}:${window.location.port + 1}`;

export const isBeta = import.meta.env.MODE === "beta"; // this checks to see if the env mode is development. Technically this gives the same value for beta AND for dev envs

export function setCookie(cName: string, cValue: string): void {
  const expiration = new Date();
  expiration.setTime(new Date().getTime() + 3600000 * 24 * 30 * 3 /*7*/);
  document.cookie = `${cName}=${cValue};Secure;SameSite=Strict;Domain=${
    window.location.hostname
  };Path=/;Expires=${expiration.toUTCString()}`;
}

export function removeCookie(cName: string): void {
  if (isBeta) {
    document.cookie = `${cName}=;Secure;SameSite=Strict;Domain=poketernity.com;Path=/;Max-Age=-1`; // we need to remove the cookie from the main domain as well
  }

  document.cookie = `${cName}=;Secure;SameSite=Strict;Domain=${window.location.hostname};Path=/;Max-Age=-1`;
  document.cookie = `${cName}=;Secure;SameSite=Strict;Path=/;Max-Age=-1`; // legacy cookie without domain, for older cookies to prevent a login loop
}

export function getCookie(cName: string): string {
  // check if there are multiple cookies with the same name and delete them
  if (document.cookie.split(";").filter((c) => c.includes(cName)).length > 1) {
    removeCookie(cName);
    return "";
  }
  const name = `${cName}=`;
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

/**
 * Alias for the constructor of a class.
 * Can be used to build an object of templated type.
 * Use {@linkcode AbstractConstructor} instead if comparing types
 */
export type Constructor<T> = new (...args: unknown[]) => T;
/**
 * Alias for an abstract constructor of a class.
 * Should be used when comparing types, e.g. with `instanceof`.
 */
export type AbstractConstructor<T> = abstract new (...args: unknown[]) => T;

export class BooleanHolder {
  public value: boolean;

  constructor(value: boolean) {
    this.value = value;
  }
}

export class NumberHolder {
  public value: number;

  constructor(value: number) {
    this.value = value;
  }
}

/**
 * Holds a fixed number value, this is solely used to differentiate between a regular number
 * and a constant or fixed number.
 * This is used in the game speed system to differentiate between a fixed game speed and a dynamic one.
 * @see `transformValue` in {@linkcode initGameSpeed}
 */
export class FixedNumber {
  public readonly value: number;

  constructor(value: number) {
    this.value = value;
  }
}

/**
 * Helper method to create a {@linkcode FixedNumber}
 * @param value - The value to be stored in the {@linkcode FixedNumber}
 */
export function fixedNumber(value: number): number {
  return new FixedNumber(value) as unknown as number;
}

export function rgbToHsv(r: number, g: number, b: number): number[] {
  const v = Math.max(r, g, b);
  const c = v - Math.min(r, g, b);
  const h = c && (v === r ? (g - b) / c : v === g ? 2 + (b - r) / c : 4 + (r - g) / c);
  return [60 * (h < 0 ? h + 6 : h), v && c / v, v];
}

/**
 * Compare color difference in RGB
 * @param rgb1 First RGB color in array
 * @param rgb2 Second RGB color in array
 */
export function deltaRgb(rgb1: number[], rgb2: number[]): number {
  const [r1, g1, b1] = rgb1;
  const [r2, g2, b2] = rgb2;
  const drp2 = Math.pow(r1 - r2, 2);
  const dgp2 = Math.pow(g1 - g2, 2);
  const dbp2 = Math.pow(b1 - b2, 2);
  const t = (r1 + r2) / 2;

  return Math.ceil(Math.sqrt(2 * drp2 + 4 * dgp2 + 3 * dbp2 + (t * (drp2 - dbp2)) / 256));
}

export function rgbHexToRgba(hex: string): { r: number; g: number; b: number; a: number } {
  const color = hex.match(/^([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i) ?? ["000000", "00", "00", "00"];
  return {
    r: parseInt(color[1], 16),
    g: parseInt(color[2], 16),
    b: parseInt(color[3], 16),
    a: 255,
  };
}

export function rgbaToInt(rgba: number[]): number {
  return (rgba[0] << 24) + (rgba[1] << 16) + (rgba[2] << 8) + rgba[3];
}

/**
 * Provided valid HSV values, calculates and stitches together a string of that
 * HSV color's corresponding hex code.
 *
 * Sourced from {@link https://stackoverflow.com/a/44134328}.
 * @param h Hue in degrees, must be in a range of [0, 360]
 * @param s Saturation percentage, must be in a range of [0, 1]
 * @param l Ligthness percentage, must be in a range of [0, 1]
 * @returns a string of the corresponding color hex code with a "#" prefix
 */
export function hslToHex(h: number, s: number, l: number): string {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const rgb = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(rgb * 255)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Prints the type and name of all game objects in a container for debugging purposes
 * @param container container with game objects inside it
 */
export function printContainerList(container: Phaser.GameObjects.Container): void {
  console.log(
    container.list.map((go) => {
      return { type: go.type, name: go.name };
    }),
  );
}

/**
 * Perform a deep copy of an object.
 *
 * @param values - The object to be deep copied.
 * @returns A new object that is a deep copy of the input.
 */
export function deepCopy<T>(values: T): T {
  return Phaser.Utils.Objects.DeepCopy(values as unknown as object) as T;
}

export function isNullOrUndefined(object: any): object is undefined | null {
  return null === object || undefined === object;
}

/**
 * This function is used in the context of a Pokémon battle game to calculate the actual integer damage value from a float result.
 * Many damage calculation formulas involve various parameters and result in float values.
 * The actual damage applied to a Pokémon's HP must be an integer.
 * This function helps in ensuring that by flooring the float value and enforcing a minimum damage value.
 *
 * @param value - The float value to convert.
 * @param minValue - The minimum integer value to return. Defaults to 1.
 * @returns The converted value as an integer.
 */
export function toDmgValue(value: number, minValue: number = 1): number {
  return Math.max(Math.floor(value), minValue);
}

/**
 * Check if a number is **inclusive** between two numbers
 * @param num the number to check
 * @param min the minimum value (included)
 * @param max the maximum value (included)
 * @returns `true` if number is **inclusive** between min and max
 */
export function isBetween(num: number, min: number, max: number): boolean {
  return num >= min && num <= max;
}

/**
 * Check if a language is supported
 * @param key The key of the language to check
 * @returns `true` if the language is supported
 */
export function isSupportedLanguage(key: string): boolean {
  return supportedLanguages.some((l) => l.key === key);
}

/**
 * Check if the device has a touchscreen.
 *
 * @returns `true` if the device has a touchscreen, otherwise `false`.
 */
export function hasTouchscreen(): boolean {
  return window.matchMedia("(hover: none), (pointer: coarse)").matches;
}

/**
 * Check if the device is in landscape mode.
 * @returns `true` if the device is in landscape mode, otherwise `false` which means it is in portrait mode.
 */
export function isLandscapeMode(): boolean {
  const { width, height } = window.screen;
  return width > height;
}

/**
 * Recursively calls `Object.freeze` on an object and all its properties.
 * @param obj - The object to freeze
 * @returns The input object after it has been frozen
 * @see {@link https://github.com/smogon/pokemon-showdown/blob/c4a5ed50e4369bda543c016e33b01a08e0b20640/lib/utils.ts#L348-L360} */
export function deepFreeze<T>(obj: T): Readonly<T> {
  if (obj === null || typeof obj !== "object") return obj;
  // support objects with reference loops
  if (Object.isFrozen(obj)) return obj;

  Object.freeze(obj);
  if (Array.isArray(obj)) {
    for (const elem of obj) deepFreeze(elem);
  } else {
    for (const elem of Object.values(obj)) deepFreeze(elem);
  }
  return obj;
}

/** @returns `true` if the input is a `Pokemon` object */
export function isPokemon(data: any): data is Pokemon {
  return data.hasOwnProperty("type") && data.type === "Pokemon";
}
