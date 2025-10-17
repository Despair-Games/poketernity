import type { ObjectValues } from "#types/utility-types";

/** Enum that comprises all possible stat-related attributes, in-battle and permanent, of a Pokemon. */
export const Stat = {
  /** Hit Points */
  HP: 0,
  /** Attack */
  ATK: 1,
  /** Defense */
  DEF: 2,
  /** Special Attack */
  SPATK: 3,
  /** Special Defense */
  SPDEF: 4,
  /** Speed */
  SPD: 5,
  /** Accuracy */
  ACC: 6,
  /** Evasiveness */
  EVA: 7,
} as const;

export type Stat = ObjectValues<typeof Stat>;

/** A constant array comprised of the {@linkcode Stat} values that make up {@linkcode PermanentStat}. */
export const PERMANENT_STATS = [Stat.HP, Stat.ATK, Stat.DEF, Stat.SPATK, Stat.SPDEF, Stat.SPD] as const;
/** Type used to describe the core, permanent stats of a Pokemon. */
export type PermanentStat = (typeof PERMANENT_STATS)[number];

/** A constant array comprised of the {@linkcode Stat} values that make up {@linkcode EffectiveStat}. */
export const EFFECTIVE_STATS = [Stat.ATK, Stat.DEF, Stat.SPATK, Stat.SPDEF, Stat.SPD] as const;
/** Type used to describe the intersection of core stats and stats that have stages in battle. */
export type EffectiveStat = (typeof EFFECTIVE_STATS)[number];

/** A constant array comprised of {@linkcode Stat} values that make up {@linkcode BattleStat}. */
export const BATTLE_STATS = [Stat.ATK, Stat.DEF, Stat.SPATK, Stat.SPDEF, Stat.SPD, Stat.ACC, Stat.EVA] as const;
/** Type used to describe the stats that have stages which can be incremented and decremented in battle. */
export type BattleStat = (typeof BATTLE_STATS)[number];

/** A constant array comprised of {@linkcode Stat} values that make up {@linkcode TempBattleStat}. */
export const TEMP_BATTLE_STATS = [Stat.ATK, Stat.DEF, Stat.SPATK, Stat.SPDEF, Stat.SPD, Stat.ACC] as const;
/** Type used to describe the stats that have X item (`TEMP_STAT_STAGE_BOOSTER`) equivalents. */
export type TempBattleStat = (typeof TEMP_BATTLE_STATS)[number];

/**
 * Provides the translation key corresponding to the amount of stat stages being changed
 * and whether those stat stages are positive or negative.
 * @param stages - The amount of stages being changed
 * @param isIncrease - Whether the stat stages are being increased or decreased
 * @returns The appropriate i18n key
 */
export function getStatStageChangeDescriptionKey(stages: number, isIncrease: boolean) {
  if (isIncrease) {
    switch (stages) {
      case 0:
        return "battle:statWontGoAnyHigher";
      case 1:
        return "battle:statRose";
      case 2:
        return "battle:statSharplyRose";
      default:
        return "battle:statRoseDrastically";
    }
  }
  switch (stages) {
    case 0:
      return "battle:statWontGoAnyLower";
    case 1:
      return "battle:statFell";
    case 2:
      return "battle:statHarshlyFell";
    default:
      return "battle:statSeverelyFell";
  }
}
