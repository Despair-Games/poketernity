//#region Generic ME constants

import { AbilityId } from "#enums/ability-id";
import { SpeciesId } from "#enums/species-id";
import type { NonEmptyArray } from "#types/utility-types";

/** Min - Max waves for mystery encounter in classic mode. */
export const CLASSIC_MODE_MYSTERY_ENCOUNTER_WAVES = Object.freeze<[min: number, max: number]>([10, 180]);

/** Min - Max waves for mystery encounter in challenge mode. */
export const CHALLENGE_MODE_MYSTERY_ENCOUNTER_WAVES = Object.freeze<[min: number, max: number]>([10, 180]);

/**
 * Spawn chance: ({@linkcode ME_BASE_SPAWN_WEIGHT} `+` {@linkcode ME_WEIGHT_INCREMENT_ON_SPAWN_MISS} `*` `<number of missed spawns>`) `/` {@linkcode ME_MAX_SPAWN_WEIGHT}
 */
export const ME_BASE_SPAWN_WEIGHT = 3;

/**
 * The divisor for determining ME spawns, defines the "maximum" weight required for a spawn.
 *
 * If `spawn_weight ===` {@linkcode ME_MAX_SPAWN_WEIGHT}, 100% chance to spawn a ME
 */
export const ME_MAX_SPAWN_WEIGHT = 256;

/**
 * When an ME spawn roll fails, {@linkcode ME_WEIGHT_INCREMENT_ON_SPAWN_MISS} is added to future rolls for ME spawn checks.
 *
 * These values are cleared whenever the next ME spawns, and spawn weight returns to {@linkcode ME_BASE_SPAWN_WEIGHT}
 */
export const ME_WEIGHT_INCREMENT_ON_SPAWN_MISS = 3;

/**
 * Specifies the target average for total ME spawns in a single Classic run.
 *
 * Used by anti-variance mechanic to check whether a run is above or below the target on a given wave.
 */
export const ME_AVERAGE_ENCOUNTERS_PER_RUN_TARGET = 12;

/**
 * Will increase/decrease the chance of spawning a ME based on the current run's total MEs encountered vs {@linkcode ME_AVERAGE_ENCOUNTERS_PER_RUN_TARGET}
 * @example
 * ```text
 * Average-Encounters-Per-Run = 17 (expects avg 1 ME every 10 floors)
 * Anti-Variance-Weight = 15
 *
 * On wave 20, if 1 ME has been encountered, the difference from expected average is 0 MEs.
 * So anti-variance adds 0/256 to the spawn weight check for ME spawn.
 *
 * On wave 20, if 0 MEs have been encountered, the difference from expected average is 1 ME.
 * So anti-variance adds 15/256 to the spawn weight check for ME spawn.
 *
 * On wave 20, if 2 MEs have been encountered, the difference from expected average is -1 ME.
 * So anti-variance adds -15/256 to the spawn weight check for ME spawn.
 * ```
 */
export const ME_ANTI_VARIANCE_WEIGHT_MODIFIER = 15;

//#endregion
//#region Clowning Around

export const BLACEPHALON_RANDOM_ABILITY_POOL = Object.freeze<AbilityId[]>([
  AbilityId.STURDY,
  AbilityId.PICKUP,
  AbilityId.INTIMIDATE,
  AbilityId.GUTS,
  AbilityId.DROUGHT,
  AbilityId.DRIZZLE,
  AbilityId.SNOW_WARNING,
  AbilityId.SAND_STREAM,
  AbilityId.ELECTRIC_SURGE,
  AbilityId.PSYCHIC_SURGE,
  AbilityId.GRASSY_SURGE,
  AbilityId.MISTY_SURGE,
  AbilityId.MAGICIAN,
  AbilityId.SHEER_FORCE,
  AbilityId.PRANKSTER,
]);

//#endregion
//#region The Expert Pokemon Breeder

export const EXPERT_POKEMON_BREEDER_POOL_1_POKEMON = Object.freeze<NonEmptyArray<SpeciesId>>([
  SpeciesId.SNORLAX,
  SpeciesId.BLISSEY,
  SpeciesId.MAGMORTAR,
  SpeciesId.ELECTIVIRE,
  SpeciesId.LUCARIO,
  SpeciesId.ROSERADE,
  SpeciesId.TOXTRICITY,
  SpeciesId.MR_MIME,
]);

export const EXPERT_POKEMON_BREEDER_POOL_2_POKEMON = Object.freeze<NonEmptyArray<SpeciesId>>([
  SpeciesId.RAICHU,
  SpeciesId.ALOLA_RAICHU,
  SpeciesId.JYNX,
  SpeciesId.HITMONLEE,
  SpeciesId.HITMONCHAN,
  SpeciesId.HITMONTOP,
  SpeciesId.WIGGLYTUFF,
  SpeciesId.AZUMARILL,
  SpeciesId.WOBBUFFET,
  SpeciesId.CHIMECHO,
  SpeciesId.SUDOWOODO,
  SpeciesId.MANTINE,
]);
