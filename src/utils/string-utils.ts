import { LARGE_NUMBER_ABBREVIATIONS } from "#constants/game-constants";
import { MoneyFormat } from "#enums/money-format";
import { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import { DEFAULT_LANGUAGE_KEY, supportedLanguages } from "#system/supported-languages";
import i18next from "i18next";

export function toReadableString(str: string): string {
  return str
    .replace(/\_/g, " ")
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
export function formatLargeNumber(count: number, threshold: number = 1000): string {
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

/**
 * @returns The input string, formatted in title case
 * @example
 * toTitleCase("an EXAMPLE string"); // Output "An example string"
 */
export function toTitleCase(unformattedText: string): string {
  const text = unformattedText.split("_");
  for (let i = 0; i < text.length; i++) {
    text[i] = text[i].charAt(0).toUpperCase() + text[i].substring(1).toLowerCase();
  }

  return text.join(" ");
}

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
 * Capitalizes the first letter of a string
 */
export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * @returns The animation filename for the given move
 */
export function animationFileName(moveId: MoveId): string {
  return MoveId[moveId].toLowerCase().replace(/\_/g, "-");
}

/**
 * Transforms a camelCase string into a kebab-case string
 *
 * @source {@link https://stackoverflow.com/a/67243723/}
 */
export function camelCaseToKebabCase(str: string): string {
  return str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, (s, o) => (o ? "-" : "") + s.toLowerCase());
}
