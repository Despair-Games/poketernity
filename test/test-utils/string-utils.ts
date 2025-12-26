import type { Stat } from "#enums/stat";
import type { EnumOrObject, InferKeys, NormalEnum, ObjectValues } from "#types/utility-types";
import { getStatKey } from "#utils/i18n-utils";
import { toTitleCase } from "#utils/string-utils";
import type { MatcherState } from "@vitest/expect";
import i18next from "i18next";

type Casing = "Preserve" | "Title";

interface getEnumStrKeyOptions {
  /**
   * A string denoting the casing method to use.
   * @defaultValue "Preserve"
   */
  casing?: Casing;
  /**
   * If present, will be prepended to the beginning of the key name string.
   */
  prefix?: string;
  /**
   * If present, will be added to the end of the key name string.
   */
  suffix?: string;
}

interface getEnumStrValueOptions {
  /**
   * A numeric base that will be used to convert `val` into a number.
   * @remarks
   * Special formatting will be applied for binary, octal and hexadecimal to add base prefixes, \
   * and should be omitted if a string value is passed.
   * @defaultValue `10`
   */
  base?: number;
  /**
   * The amount of padding to add to the numeral representation.
   * @defaultValue `0`
   */
  padding?: number;
}

/**
 * Options type for `getEnumStr` and company.
 *
 * Selectively includes properties based on the type of `Val`
 */
type getEnumStrOptions<Val extends string | number = string | number, X extends boolean = boolean> = {
  /**
   * Whether to omit the enum members' values from the output.
   * @defaultValue Whether `Val` is a string
   */
  excludeValues?: X;
} & getEnumStrKeyOptions &
  ([Val] extends [string] ? unknown : [X] extends [true] ? unknown : getEnumStrValueOptions);

/**
 * Return the name of an enum member or `const object` value, alongside its corresponding value.
 * @param obj - The `EnumOrObject` to source reverse mappings from
 * @param val - One of `obj`'s values to stringify
 * @param options - Optional parameters modifying the stringification process
 * @returns The stringified representation of `val` as dictated by the options.
 * @example
 * ```ts
 * enum testEnum {
 *   ONE = 1,
 *   TWO = 2,
 *   THREE = 3,
 * }
 * getEnumStr(testEnum, testEnum.ONE); // Output: "ONE (=1)"
 * getEnumStr(testEnum, testEnum.TWO, {casing: "Title", prefix: "testEnum.", suffix: "!!!"}); // Output: "testEnum.TWO!!! (=2)"
 * ```
 */
export function getEnumStr<E extends EnumOrObject, V extends E[keyof E], X extends boolean>(
  obj: E,
  val: V,
  options: getEnumStrOptions<V, X> = {},
): string {
  const {
    casing = "Preserve",
    prefix = "",
    suffix = "",
    excludeValues = typeof val === "string",
    base = 10,
    padding = 0,
  } = options as getEnumStrOptions;

  const keyPart = excludeValues ? "" : getKeyPart(obj, val, { casing, prefix, suffix });
  const valuePart = typeof val === "string" ? val : getValuePart(val, { base, padding });

  return `${keyPart} ${valuePart}`.trim();
}

function getKeyPart<E extends EnumOrObject, V extends E[keyof E]>(
  obj: E,
  val: V,
  { casing, prefix, suffix }: Required<getEnumStrKeyOptions>,
): string {
  let casingFunc: (s: string) => string;
  switch (casing) {
    case "Preserve":
      casingFunc = (s) => s;
      break;
    case "Title":
      casingFunc = toTitleCase;
      break;
  }

  const keyName =
    obj[val] !== undefined
      ? // TS reverse mapped enum
        (obj[val] as string)
      : // Normal enum / `const object`
        // TODO: Figure out a way to cache the names of commonly-used enum numbers for performance if needed
        (testEnumValueToKey(obj as NormalEnum<E>, val) as string);

  return `${prefix}${casingFunc(keyName)}${suffix}`;
}

/**
 * Helper function used by `getEnumStr` and company to format the "value" part of a numeric enum value.
 * @param val - The value to be stringified
 * @param options - Options modifying the stringification process
 * @param addParen - Whether to add enclosing parentheses and `=` sign; default `true`
 * @returns The stringified version of `val`
 */
function getValuePart(val: number, options: Required<getEnumStrValueOptions>, addParen = true): string {
  const { base, padding } = options;
  const valFormatted = `${getPrefixForBase(base)}${val.toString(base).toUpperCase().padStart(padding, "0")}`;

  return addParen ? `(=${valFormatted})` : valFormatted;
}

function getPrefixForBase(base: number): string {
  switch (base) {
    case 2:
      return "0b";
    case 8:
      return "0o";
    case 16:
      return "0x";
    default:
      return "";
  }
}

/**
 * Convert an array of enums or `const object`s into a readable string version.
 * @param obj - The `EnumOrObject` to source reverse mappings from
 * @param values - An array of `obj`'s values to convert into strings
 * @param options - Optional parameters modifying the stringification process
 * @returns The stringified representation of `enums`.
 * @example
 * ```ts
 * enum testEnum {
 *   ONE = 1,
 *   TWO = 2,
 *   THREE = 3,
 * }
 * const vals = [testEnum.ONE, testEnum.TWO, testEnum.THREE] as const;
 *
 * console.log(stringifyEnumArray(testEnum, vals));
 * // Output: "[ONE, TWO, THREE] (=[1, 2, 3])";
 * console.log(stringifyEnumArray(testEnum, vals, {prefix: "Thing ", suffix: " Yeah", exclude: "values"}));
 * // Output: "[Thing ONE Yeah, Thing TWO Yeah, Thing THREE Yeah]";
 * ```
 */
export function stringifyEnumArray<E extends EnumOrObject, V extends E[keyof E], X extends boolean>(
  obj: E,
  values: readonly V[],
  options: getEnumStrOptions<V, X> = {},
): string {
  if (values.length === 0) {
    return "[]";
  }

  const {
    casing = "Preserve",
    prefix = "",
    suffix = "",
    excludeValues = typeof values[0] === "string",
    base = 10,
    padding = 0,
  } = options as getEnumStrOptions;

  const keyPart = values.map((v) => getKeyPart(obj, v, { casing, prefix, suffix })).join(", ");
  if (excludeValues) {
    return `[${keyPart}]`;
  }
  const valuePart =
    typeof values[0] === "string"
      ? values.join(", ")
      : (values as readonly number[]).map((v) => getValuePart(v, { base, padding }, false)).join(", ");

  return `[${keyPart}] (=[${valuePart}])`;
}

/**
 * Convert a number into an English ordinal.
 * @param num - The number to convert into an ordinal
 * @returns The ordinal representation of `num`.
 * @example
 * ```ts
 * console.log(getOrdinal(1)); // Output: "1st"
 * console.log(getOrdinal(12)); // Output: "12th"
 * console.log(getOrdinal(24)); // Output: "24th"
 * ```
 */
export function getOrdinal(num: number): string {
  const tens = num % 10;
  const hundreds = num % 100;
  if (tens === 1 && hundreds !== 11) {
    return num + "st";
  }
  if (tens === 2 && hundreds !== 12) {
    return num + "nd";
  }
  if (tens === 3 && hundreds !== 13) {
    return num + "rd";
  }
  return num + "th";
}

/**
 * Get the localized name of a {@linkcode Stat}.
 * @param s - The {@linkcode Stat} to check
 * @returns - The proper name for s, retrieved from the translations.
 */
export function getStatName(s: Stat): string {
  return i18next.t(getStatKey(s));
}

/**
 * Convert an object into a oneline diff to be shown in an error message.
 * @param obj - The object to return the oneline diff of
 * @returns The updated diff
 * @example
 * ```ts
 * const diff = getOnelineDiffStr.call(this, obj)
 * ```
 */
export function getOnelineDiffStr(this: MatcherState, obj: unknown): string {
  return this.utils
    .stringify(obj, undefined, { maxLength: 35, indent: 0, printBasicPrototype: false })
    .replace(/\n/g, " ") // Replace newlines with spaces
    .replace(/,(\s*)\}$/g, "$1}"); // Trim trailing commas
}

//! version of `enumValueToKey` with altered typings
/**
 * Return the name of the key that matches the given Enum value.
 *
 * Can be used to emulate Typescript reverse mapping for `const object`s or string enums.
 * @param object - The {@linkcode NormalEnum} to check
 * @param val - The value to get the key of
 * @returns The name of the key with the specified value
 * @example
 * const thing = {
 *   one: 1,
 *   two: 2,
 * } as const;
 * console.log(enumValueToKey(thing, 2)); // output: "two"
 * @throws Throws an {@linkcode Error} if an invalid enum value is passed to the function.
 * @remarks
 * If multiple keys map to the same value, the first one (in insertion order) will be retrieved,
 * but the return type will be the union of ALL their corresponding keys.
 */
export function testEnumValueToKey<T extends EnumOrObject, V extends ObjectValues<T>>(
  object: NormalEnum<T>,
  val: V,
): InferKeys<T, V> {
  for (const [key, value] of Object.entries(object)) {
    if (val === value) {
      return key as InferKeys<T, V>;
    }
  }
  throw new Error(`Invalid value passed to \`enumValueToKey\`! Value: ${val}`);
}
