import type { EnumValues } from "#types/utility-types";

export const MysteryEncounterMode = {
  /** {@linkcode MysteryEncounter} will always begin in this mode, but will always swap modes when an option is selected */
  DEFAULT: 1,
  /** If the {@linkcode MysteryEncounter} battle is a trainer type battle */
  TRAINER_BATTLE: 2,
  /** If the {@linkcode MysteryEncounter} battle is a wild type battle */
  WILD_BATTLE: 3,
  /** Enables special boss music during encounter */
  BOSS_BATTLE: 4,
  /** If there is no battle in the {@linkcode MysteryEncounter} or option selected */
  NO_BATTLE: 5,
} as const;

export type MysteryEncounterMode = EnumValues<typeof MysteryEncounterMode>;
