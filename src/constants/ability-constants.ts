import { AbilityId } from "#enums/ability-id";

/** Abilities perceived by the Enemy AI to have high value */
export const HIGH_VALUE_ABILITIES: Readonly<AbilityId[]> = Object.freeze([
  AbilityId.WONDER_GUARD,
  AbilityId.DESOLATE_LAND,
  AbilityId.PRIMORDIAL_SEA,
  AbilityId.HUGE_POWER,
  AbilityId.PURE_POWER,
  AbilityId.CONTRARY,
]);

/** Abilities perceived by the Enemy AI to have a detrimental effect on the source */
export const DETRIMENTAL_ABILITIES: Readonly<AbilityId[]> = Object.freeze([
  AbilityId.TRUANT,
  AbilityId.WIMP_OUT,
  AbilityId.EMERGENCY_EXIT,
  AbilityId.DEFEATIST,
  AbilityId.KLUTZ,
  AbilityId.SLOW_START,
]);
