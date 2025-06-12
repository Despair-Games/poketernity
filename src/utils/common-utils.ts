// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { initGameSpeed } from "#system/game-speed";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

import { MAX_STAT_STAGE, MIN_STAT_STAGE } from "#constants/game-constants";
import type { Pokemon } from "#field/pokemon";
import type { nil } from "#types/nil";

export function getFrameMs(frameCount: number): number {
  return Math.floor((1 / 60) * 1000 * frameCount);
}

export function getCurrentTime(): number {
  const date = new Date();
  return ((date.getHours() * 60 + date.getMinutes()) / 1440 + 0.675) % 1;
}

/**
 * Gets the keys of a TypeScript enum.
 *
 * **Warning**:
 * - **ONLY** use with TypeScript enums.
 * - **DO NOT** use on an enum with string values!
 * @returns The keys of a TypeScript enum
 */
export function getTSEnumKeys(enumType: any): string[] {
  return Object.values(enumType)
    .filter((v) => Number.isNaN(Number.parseInt(v!.toString())))
    .map((v) => v!.toString());
}

/**
 * Gets the number values of a TypeScript enum.
 *
 * **Warning**:
 * - **ONLY** use with TypeScript enums.
 * - Any non-number values are discarded!
 * @returns **ONLY** the number values of a TypeScript enum
 */
export function getTSEnumValues(enumType: any): number[] {
  return Object.values(enumType)
    .filter((v) => !Number.isNaN(Number.parseInt(v!.toString())))
    .map((v) => Number.parseInt(v!.toString()));
}

/**
 * @returns length of the TypeScript enum
 */
export function getTSEnumLength(input: any): number {
  return getTSEnumKeys(input).length;
}

export function executeIf<T>(condition: boolean, promiseFunc: () => Promise<T>): Promise<T | null> {
  return condition ? promiseFunc() : new Promise<T | null>((resolve) => resolve(null));
}

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
 * Holds a fixed number value, this is solely used to differentiate
 * between a regular number and a constant or fixed number.
 *
 * This is used in the game speed system to differentiate between a fixed game speed and a dynamic one.
 * @see `transformValue` in {@linkcode initGameSpeed}
 * @see {@linkcode fixedNumber}
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

/**
 * Prints the type and name of all game objects in a container for debugging purposes
 * @param container - The container with game objects inside it
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
 * @param obj - The object to be deep copied.
 * @returns A new object that is a deep copy of the input.
 */
export function deepCopy<T>(obj: T): T {
  return Phaser.Utils.Objects.DeepCopy(obj as unknown as object) as T;
}

/** @returns Whether the input is `null` or `undefined` */
export function isNil(obj: any): obj is nil {
  return null === obj || undefined === obj;
}

/**
 * This function is used in the context of a Pokémon battle game to calculate the actual integer damage value from a float result.
 *
 * Many damage calculation formulas involve various parameters and result in float values.
 *
 * The actual damage applied to a Pokémon's HP must be an integer.
 *
 * This function helps in ensuring that by flooring the float value and enforcing a minimum damage value.
 *
 * @param value - The input number
 * @param minValue - The minimum integer value to return. Defaults to 1
 * @returns The input number converted to an integer
 */
export function toDmgValue(value: number, minValue: number = 1): number {
  return Math.max(Math.floor(value), minValue);
}

/**
 * @returns `true` if `num` is between `[min, max]`
 */
export function isBetween(num: number, min: number, max: number): boolean {
  return min <= num && num <= max;
}

/**
 * Recursively calls `Object.freeze` on an object and all its properties.
 * @param obj - The object to freeze
 * @returns The input object after it has been frozen
 * @see {@link https://github.com/smogon/pokemon-showdown/blob/c4a5ed50e4369bda543c016e33b01a08e0b20640/lib/utils.ts#L348-L360}
 */
export function deepFreeze<T>(obj: T): Readonly<T> {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  // support objects with reference loops
  if (Object.isFrozen(obj)) {
    return obj;
  }

  Object.freeze(obj);
  if (Array.isArray(obj)) {
    for (const elem of obj) {
      deepFreeze(elem);
    }
  } else {
    for (const elem of Object.values(obj)) {
      deepFreeze(elem);
    }
  }
  return obj;
}

/** @returns `true` if the input is a `Pokemon` object */
export function isPokemon(data: any): data is Pokemon {
  return Object.hasOwn(data, "type") && data.type === "Pokemon";
}

/**
 * If the input isn't already an array, turns it into one.
 * @returns An array with the same type as the type of the input
 */
export function coerceArray<T>(input: T | readonly T[]): T[];
export function coerceArray<T>(input: T | T[]): T[] {
  return Array.isArray(input) ? [...input] : [input];
}

/**
 * Clamps a number between `min` and `max` (inclusive).
 * @param value - The value to clamp
 * @param min - The minimum value to clamp to
 * @param max - The maximum value to clamp to
 * @returns The clamped value, between `min` and `max`
 */
export function clamp(value: number, min: number, max: number): number {
  if (min > max) {
    throw new Error(`Min (${min}) > max (${max}) in clamp function!`);
  }
  return Math.max(min, Math.min(max, value));
}

/**
 * Calculates the accuracy multiplier
 * based on the user's accuracy stage and the target's evasion stage.
 *
 * *The difference is {@linkcode clamp | clamped} to [{@linkcode MIN_STAT_STAGE | -6}, {@linkcode MAX_STAT_STAGE | +6}].*
 *
 * @param userAccStage - The user's accuracy stage
 * @param targetEvaStage - The target's evasion stage
 * @returns The accuracy multiplier based on the Gen V+ accuracy formula
 *
 * | Stage ACC | -6  | -5  | -4  | -3  | -2  | -1  |  0  | +1  | +2  | +3  | +4  | +5  | +6  |
 * |-----------|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
 * | Stage EVA | +6  | +5  | +4  | +3  | +2  | +1  |  0  | -1  | -2  | -3  | -4  | -5  | -6  |
 * | Gen V+    | 3/9 | 3/8 | 3/7 | 3/6 | 3/5 | 3/4 | 3/3 | 4/3 | 5/3 | 6/3 | 7/3 | 8/3 | 9/3 |
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Stat_modifier#Stage_multipliers Stage multipliers - Bulbapedia}
 */
export function calcAccuracyMultiplier(userAccStage: number, targetEvaStage: number): number {
  const diff = clamp(userAccStage - targetEvaStage, MIN_STAT_STAGE, MAX_STAT_STAGE);

  if (diff < 0) {
    return 3 / (3 - diff);
  }

  if (diff > 0) {
    return (3 + diff) / 3;
  }

  return 1;
}

/**
 * Returns the name of the key that matches the enum [object] value.
 * @param input - The enum [object] to check
 * @param val - The value to get the key of
 * @returns The name of the key with the specified value
 * @example
 * const thing = {
 *   one: 1,
 *   two: 2,
 * } as const;
 * console.log(enumValueToKey(thing, thing.two)); // output: "two"
 * @throws An `Error` if an invalid enum value is passed to the function
 */
export function enumValueToKey<T extends Record<string, string | number>>(input: T, val: T[keyof T]): keyof T {
  for (const [key, value] of Object.entries(input)) {
    if (val === value) {
      return key as keyof T;
    }
  }
  throw new Error(`Invalid value passed to \`enumValueToKey\`! Value: ${val}`);
}
