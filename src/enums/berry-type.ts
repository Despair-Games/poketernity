export const BerryType = {
  SITRUS: 1,
  LUM: 2,
  ENIGMA: 3,
  LIECHI: 4,
  GANLON: 5,
  PETAYA: 6,
  APICOT: 7,
  SALAC: 8,
  LANSAT: 9,
  STARF: 10,
  LEPPA: 11,
} as const;

export type BerryType = (typeof BerryType)[keyof typeof BerryType];
