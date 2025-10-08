/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { MoveUsedEvent } from "#events/battle-scene";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */

import type { ObjectValues } from "#types/utility-types";

export const EggEventType = {
  /**
   * Triggers when egg count is changed.
   * @see {@linkcode MoveUsedEvent}
   */
  EGG_COUNT_CHANGED: "onEggCountChanged",
} as const;

export type EggEventType = ObjectValues<typeof EggEventType>;
