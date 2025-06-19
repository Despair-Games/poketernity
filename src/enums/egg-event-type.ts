// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { MoveUsedEvent } from "#events/battle-scene";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

import type { EnumValues } from "#types/enum-values";

export const EggEventType = {
  /**
   * Triggers when egg count is changed.
   * @see {@linkcode MoveUsedEvent}
   */
  EGG_COUNT_CHANGED: "onEggCountChanged",
} as const;

export type EggEventType = EnumValues<typeof EggEventType>;
