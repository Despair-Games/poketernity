/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { TimedEvent } from "#types/timed-event";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */

import type { ObjectValues } from "#types/utility-types";

/**
 * The various type of modifications that {@linkcode TimedEvent}s can activate.
 */
export const EventModifierType = {
  WILD_SHINY_CHANCE: 1,
  CLASSIC_CANDY_FRIENDSHIP_MULTIPLIER: 2,
  EXTRA_TRAINER_REWARDS: 3,
} as const;

export type EventModifierType = ObjectValues<typeof EventModifierType>;
