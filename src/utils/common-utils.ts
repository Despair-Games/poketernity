// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { initGameSpeed } from "#app/system/game-speed";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

import type { Pokemon } from "#app/field/pokemon";

export type nil = null | undefined;

export const MissingTextureKey = "__MISSING";

export function getFrameMs(frameCount: number): number {
  return Math.floor((1 / 60) * 1000 * frameCount);
}

export function getCurrentTime(): number {
  const date = new Date();
  return ((date.getHours() * 60 + date.getMinutes()) / 1440 + 0.675) % 1;
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
 * @returns length of the TypeScript enum
 */
export function getEnumLength(input: any): number {
  return getEnumKeys(input).length;
}

export function executeIf<T>(condition: boolean, promiseFunc: () => Promise<T>): Promise<T | null> {
  return condition ? promiseFunc() : new Promise<T | null>((resolve) => resolve(null));
}

/**
 * Alias for the constructor of a class.
 * Can be used to build an object of templated type.
 *
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

export function isNullOrUndefined(obj: any): obj is null | undefined {
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
