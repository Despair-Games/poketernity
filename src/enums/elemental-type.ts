/**
 * Enum holding the basic pokemon types, plus the pseudo-type Stellar.
 *
 * Due to `Type` being too generic, we are using `ElementalType` instead.
 *
 * > _In Generation I, **types** were occasionally referred to as **elements**._
 *
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Type}
 */
export enum ElementalType {
  UNKNOWN = -1,
  NORMAL,
  FIGHTING,
  FLYING,
  POISON,
  GROUND,
  ROCK,
  BUG,
  GHOST,
  STEEL,
  FIRE,
  WATER,
  GRASS,
  ELECTRIC,
  PSYCHIC,
  ICE,
  DRAGON,
  DARK,
  FAIRY,
  STELLAR,
}
