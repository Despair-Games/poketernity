import { type PermanentStat, Stat } from "#enums/stat";
import { enumValueToKey } from "#utils/common-utils";

/**
 * Provides the translation key corresponding to a given stat which can be translated into its full name.
 * @param stat - The {@linkcode Stat} to be translated
 * @returns The translation key corresponding to the given {@linkcode Stat}
 */
export function getStatKey(stat: Stat) {
  return `pokemonInfo:Stat.${enumValueToKey(Stat, stat)}`;
}

/**
 * Provides the translation key corresponding to a given stat which can be translated into its shortened name.
 * @param stat - The {@linkcode Stat} to be translated
 * @returns The translation key corresponding to the given {@linkcode Stat}
 */
export function getShortenedStatKey(stat: PermanentStat) {
  return `pokemonInfo:Stat.${enumValueToKey(Stat, stat)}shortened`;
}
