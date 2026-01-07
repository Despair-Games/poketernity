import type { MoveUsedEvent } from "#events/battle-scene";
import type { ObjectValues } from "#types/utility-types";

export const EggEventType = {
  /**
   * Triggers when egg count is changed.
   * @see {@linkcode MoveUsedEvent}
   */
  EGG_COUNT_CHANGED: "onEggCountChanged",
} as const;

export type EggEventType = ObjectValues<typeof EggEventType>;
