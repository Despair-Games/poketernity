// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { MoveUsedEvent } from "#events/battle-scene";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

export const EggEventType = {
  /**
   * Triggers when egg count is changed.
   * @see {@linkcode MoveUsedEvent}
   */
  EGG_COUNT_CHANGED: "onEggCountChanged",
} as const;

export type EggEventType = (typeof EggEventType)[keyof typeof EggEventType];
