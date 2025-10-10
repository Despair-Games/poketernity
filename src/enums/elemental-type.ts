import type { ObjectValues } from "#types/utility-types";

/**
 * Enum holding the basic pokemon types, plus the pseudo-type Stellar.
 *
 * Due to `Type` being too generic, we are using `ElementalType` instead.
 *
 * > _In Generation I, **types** were occasionally referred to as **elements**._
 *
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Type}
 */
export const ElementalType = {
  UNKNOWN: -1,
  NORMAL: 1,
  FIGHTING: 2,
  FLYING: 3,
  POISON: 4,
  GROUND: 5,
  ROCK: 6,
  BUG: 7,
  GHOST: 8,
  STEEL: 9,
  FIRE: 10,
  WATER: 11,
  GRASS: 12,
  ELECTRIC: 13,
  PSYCHIC: 14,
  ICE: 15,
  DRAGON: 16,
  DARK: 17,
  FAIRY: 18,
  STELLAR: 19,
} as const;

export type ElementalType = ObjectValues<typeof ElementalType>;
