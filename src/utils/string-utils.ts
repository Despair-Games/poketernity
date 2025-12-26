import { IS_TEST } from "#constants/app-constants";
import { LARGE_NUMBER_ABBREVIATIONS } from "#constants/game-constants";
import { MoneyFormat } from "#enums/money-format";
import { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import { DEFAULT_LANGUAGE_KEY, supportedLanguages } from "#system/supported-languages";
import i18next from "i18next";

export function toReadableString(str: string): string {
  return str
    .replace(/_/g, " ")
    .split(" ")
    .map((s) => `${s.slice(0, 1)}${s.slice(1).toLowerCase()}`)
    .join(" ");
}

export function shiftCharCodes(str: string, shiftCount: number = 0): string {
  let newStr = "";

  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    const newCharCode = charCode + shiftCount;
    newStr += String.fromCharCode(newCharCode);
  }

  return newStr;
}

export function leftPad(value: number | string, length: number, padWith: string = "0"): string {
  let valueStr = value.toString();
  while (valueStr.length < length) {
    valueStr = `${padWith}${valueStr}`;
  }
  return valueStr;
}
const secondsInHour = 3600;

export function getPlayTimeString(totalSeconds: number): string {
  const days = `${Math.floor(totalSeconds / (secondsInHour * 24))}`;
  const hours = `${Math.floor((totalSeconds % (secondsInHour * 24)) / secondsInHour)}`;
  const minutes = `${Math.floor((totalSeconds % secondsInHour) / 60)}`;
  const seconds = `${Math.floor(totalSeconds % 60)}`;

  return `${days.padStart(2, "0")}:${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`;
}

/**
 * Return an abbreviated representation of the given number, with up to 2 digits past the decimal point.
 * @example
 * formatLargeNumber(2300); // Output "2.3K"
 * @param number - The number to format
 * @param fractionDigits - (Default `1000`) The threshold under which not to abbreviate the number.
 * @returns the formatted string
 */
function formatLargeNumber(count: number, threshold: number = 1000): string {
  if (count < threshold) {
    return count.toString();
  }
  const ret = count.toString();
  const suffix = LARGE_NUMBER_ABBREVIATIONS[Math.ceil(ret.length / 3) - 1] ?? "?";
  const digits = ((ret.length + 2) % 3) + 1;
  let decimalNumber = ret.slice(digits, digits + 2);
  while (decimalNumber.endsWith("0")) {
    decimalNumber = decimalNumber.slice(0, -1);
  }

  // TODO: need to localize this properly. Not all languages use . as decimal part separator
  return `${ret.slice(0, digits)}${decimalNumber ? `.${decimalNumber}` : ""}${suffix}`;
}

/**
 * Return an abbreviated representation of the given number, with a fixed number of digits past the decimal point.
 * @example
 * formatLargeNumberFixedDigits(2300, 2); // Output "2.30K"
 * @param number - The number to format
 * @param fractionDigits - (Default `3`) The number of digits to show after the decimal point.
 * @returns the formatted string
 */
export function formatLargeNumberFixedDigits(number: number, fractionDigits: number = 3): string {
  let exponent: number;

  if (number < 1000) {
    exponent = 0;
  } else {
    const maxExp = LARGE_NUMBER_ABBREVIATIONS.length - 1;

    exponent = Math.floor(Math.log(number) / Math.log(1000));
    exponent = Math.min(exponent, maxExp);

    number /= Math.pow(1000, exponent);
  }

  return `${exponent === 0 || number % 1 === 0 ? number : number.toFixed(fractionDigits)}${LARGE_NUMBER_ABBREVIATIONS[exponent]}`;
}

export function formatMoney(format: MoneyFormat, amount: number): string {
  if (format === MoneyFormat.ABBREVIATED) {
    return formatLargeNumberFixedDigits(amount);
  }
  return amount.toLocaleString();
}

export function formatStat(stat: number, forHp: boolean = false): string {
  return formatLargeNumber(stat, forHp ? 100000 : 1000000);
}

/**
 * Get the abbreviated representation of a Pokemon's level. For example `Lv2.3K`
 */
export function getPokemonLevelText(pokemon: Pokemon): string {
  return `${i18next.t("saveSlotSelectUiHandler:lv")}${formatLargeNumber(pokemon.level)}`;
}

// TODO: replace with `toCamelCase`
export function toCamelCaseString(unformattedText: string): string {
  if (!unformattedText) {
    return "";
  }
  return unformattedText
    .split(/[_ ]/)
    .filter((f) => f)
    .map((f, i) => (i ? `${f[0].toUpperCase()}${f.slice(1).toLowerCase()}` : f.toLowerCase()))
    .join("");
}

/**
 * This function checks if all localized images used by the game have been added for the given language.
 * @param key - The language key (e.g. "ko").
 * @returns `true` if the given language is supported and has localized sprites.
 */
function hasAllLocalizedSprites(key: string): boolean {
  return supportedLanguages.some((lang) => lang.key === key && lang.hasAllLocalizedImages);
}

/**
 * Helper method to localize a filename (e.g. for types icons) based on the given language.
 *
 * Defaults to English if the language is not a {@linkcode supportedLanguages} or does not have all pictures defined.
 * @param baseName - The original name of the file (e.g. `types`)
 * @param langKey - (Optional) The language key (e.g. "en").
 * @returns the localized sprite key, of form "baseKey_{languageKey}"
 */
export function getLocalizedFilename(baseName: string, langKey?: string): string {
  if (!langKey) {
    langKey = i18next.resolvedLanguage ?? DEFAULT_LANGUAGE_KEY;
  }
  return `${baseName}_${hasAllLocalizedSprites(langKey) ? `${langKey}` : DEFAULT_LANGUAGE_KEY}`;
}

/**
 * Truncate a string to a specified maximum length and add an ellipsis if it exceeds that length.
 * @param str - The string to be truncated.
 * @param maxLength - (Default `10`) The maximum length of the truncated string.
 * @returns The truncated string with an ellipsis if it was longer than maxLength.
 */
export function truncateString(str: string, maxLength: number = 10): string {
  if (str.length > maxLength) {
    // Subtracts 3 to accommodate the ellipsis
    return str.slice(0, maxLength - 3) + "...";
  }

  return str;
}

/**
 * Capitalize a string.
 *
 * @param str - The string to be capitalized.
 * @param sep - The separator between the words of the string.
 * @param lowerFirstChar - Whether the first character of the string should be lowercase or not.
 * @param returnWithSpaces - Whether the returned string should have spaces between the words or not.
 * @returns The capitalized string.
 */
export function capitalizeString(
  str: string,
  sep: string,
  lowerFirstChar: boolean = true,
  returnWithSpaces: boolean = false,
): string | null {
  if (str) {
    const splitedStr = str.toLowerCase().split(sep);

    for (let i = +lowerFirstChar; i < splitedStr?.length; i++) {
      splitedStr[i] = splitedStr[i].charAt(0).toUpperCase() + splitedStr[i].substring(1);
    }

    return returnWithSpaces ? splitedStr.join(" ") : splitedStr.join("");
  }
  return null;
}

/**
 * Capitalize the first letter of a string.
 * @param str - The string whose first letter is to be capitalized
 * @returns The original string with its first letter capitalized.
 * @example
 * ```ts
 * console.log(capitalizeFirstLetter("consectetur adipiscing elit")); // returns "Consectetur adipiscing elit"
 * ```
 */
export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * @returns The animation filename for the given move
 */
export function animationFileName(moveId: MoveId): string {
  return MoveId[moveId].toLowerCase().replace(/_/g, "-");
}

/**
 * Transforms a camelCase string into a kebab-case string
 *
 * @see {@link https://stackoverflow.com/a/67243723/}
 */
// TODO: replace with `toKebabCase`
export function camelCaseToKebabCase(str: string): string {
  return str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, (s, o) => (o ? "-" : "") + s.toLowerCase());
}

/**
 * Transform a string to camelCase
 */
// TODO: replace with `toCamelCase`
export function camelizeString(string: string): string {
  return string
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase()))
    .replace(/\s+/g, "");
}

// #region Split string code

// Regexps involved with splitting words in various case formats.
// Sourced from https://www.npmjs.com/package/change-case (with slight tweaking here and there)

/** Regex to split at word boundaries. */
const SPLIT_LOWER_UPPER_RE = /([\p{Ll}\d])(\p{Lu})/gu;
/** Regex to split around single-letter uppercase words. */
const SPLIT_UPPER_UPPER_RE = /(\p{Lu})([\p{Lu}][\p{Ll}])/gu;
/** Regexp involved with stripping non-word delimiters from the result. */
const DELIM_STRIP_REGEXP = /[-_ ]+/giu;
/** The replacement value for splits. */
const SPLIT_REPLACE_VALUE = "$1\0$2";

/**
 * Split any cased string into an array of its constituent words.
 * @param string - The string to be split
 * @returns The new string, delimited at each instance of one or more spaces, underscores, hyphens
 * or lower-to-upper boundaries.
 */
function splitWords(value: string): string[] {
  let result = value.trim();
  result = result.replace(SPLIT_LOWER_UPPER_RE, SPLIT_REPLACE_VALUE).replace(SPLIT_UPPER_UPPER_RE, SPLIT_REPLACE_VALUE);
  result = result.replace(DELIM_STRIP_REGEXP, "\0");

  // Trim the delimiter from around the output string
  return trimFromStartAndEnd(result, "\0").split(/\0/g);
}

/**
 * Helper function to remove one or more sequences of characters from either end of a string.
 * @param str - The string to replace
 * @param charToTrim - The string to remove
 * @returns The result of removing all instances of {@linkcode charsToTrim} from either end of {@linkcode str}.
 */
function trimFromStartAndEnd(str: string, charToTrim: string): string {
  let start = 0;
  let end = str.length;
  const blockLength = charToTrim.length;

  while (str.startsWith(charToTrim, start)) {
    start += blockLength;
  }
  if (start - end === blockLength) {
    // Occurs if the ENTIRE string is made up of `charToTrim` (at which point we return nothing)
    return "";
  }
  while (str.endsWith(charToTrim, end)) {
    end -= blockLength;
  }
  return str.slice(start, end);
}

/**
 * Helper method to convert a string into `Title Case` (such as one used for console logs).
 * @param str - The string being converted
 * @returns The result of converting `str` into title case.
 * @example
 * ```ts
 * console.log(toTitleCase("lorem ipsum dolor sit amet")); // returns "Lorem Ipsum Dolor Sit Amet"
 * ```
 */
export function toTitleCase(str: string): string {
  return splitWords(str)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Helper method to convert a string into `camelCase` (such as one used for i18n keys).
 * @param str - The string being converted
 * @returns The result of converting `str` into camel case.
 * @example
 * ```ts
 * console.log(toCamelCase("BIG_ANGRY_TRAINER")); // returns "bigAngryTrainer"
 * ```
 */
export function toCamelCase(str: string): string {
  return splitWords(str)
    .map((word, index) =>
      index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join("");
}

/**
 * Helper method to convert a string into `PascalCase`.
 * @param str - The string being converted
 * @returns The result of converting `str` into pascal case.
 * @example
 * ```ts
 * console.log(toPascalCase("hi how was your day")); // returns "HiHowWasYourDay"
 * ```
 * @remarks
 */
export function toPascalCase(str: string): string {
  return splitWords(str)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

/**
 * Helper method to convert a string into `kebab-case` (such as one used for filenames).
 * @param str - The string being converted
 * @returns The result of converting `str` into kebab case.
 * @example
 * ```ts
 * console.log(toKebabCase("not_kebab-caSe String")); // returns "not-kebab-case-string"
 * ```
 */
export function toKebabCase(str: string): string {
  return splitWords(str)
    .map((word) => word.toLowerCase())
    .join("-");
}

/**
 * Helper method to convert a string into `snake_case` (such as one used for filenames).
 * @param str - The string being converted
 * @returns The result of converting `str` into snake case.
 * @example
 * ```ts
 * console.log(toSnakeCase("not-in snake_CaSe")); // returns "not_in_snake_case"
 * ```
 */
export function toSnakeCase(str: string): string {
  return splitWords(str)
    .map((word) => word.toLowerCase())
    .join("_");
}

/**
 * Helper method to convert a string into `UPPER_SNAKE_CASE`.
 * @param str - The string being converted
 * @returns The result of converting `str` into upper snake case.
 * @example
 * ```ts
 * console.log(toUpperSnakeCase("apples bananas_oranGes-PearS")); // returns "APPLES_BANANAS_ORANGES_PEARS"
 * ```
 */
export function toUpperSnakeCase(str: string): string {
  return splitWords(str)
    .map((word) => word.toUpperCase())
    .join("_");
}

/**
 * Helper method to convert a string into `Pascal_Snake_Case`.
 * @param str - The string being converted
 * @returns The result of converting `str` into pascal snake case.
 * @example
 * ```ts
 * console.log(toPascalSnakeCase("apples-bananas_oranGes Pears")); // returns "Apples_Bananas_Oranges_Pears"
 * ```
 */
export function toPascalSnakeCase(str: string): string {
  return splitWords(str)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("_");
}
// #endregion Split String code

/**
 * Chunk a string into an array, creating a new element every `length` characters.
 * @param str - The string to chunk
 * @param length - The length of each chunk; should be a non-negative integer
 * @returns The result of splitting `str` after every instance of `length` characters.
 * @example
 * ```ts
 * console.log(chunkString("123456789abc", 4)); // Output: ["1234", "5678", "9abc"]
 * console.log(chunkString("1234567890", 4)); // Output: ["1234", "5678", "90"]
 * ```
 */
export function chunkString(str: string, length: number): string[] {
  const numChunks = Math.ceil(str.length / length);
  const chunks = new Array(numChunks);

  for (let i = 0; i < numChunks; i++) {
    chunks[i] = str.substring(i * length, (i + 1) * length);
  }

  return chunks;
}

/**
 * Exports for internal testing purposes.
 *
 * ⚠️ These *must not* be used outside of tests, as they will not be defined.
 * @internal
 */
export const __INTERNAL_TEST_EXPORTS: {
  splitWords: typeof splitWords;
} = {} as any;

if (IS_TEST) {
  Object.assign(__INTERNAL_TEST_EXPORTS, { splitWords });
}
