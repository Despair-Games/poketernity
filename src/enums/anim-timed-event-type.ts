export const AnimTimedEventType = {
  /** Plays a sound effect */
  SOUND: "AnimTimedSoundEvent",
  /** Adds a background sprite to display */
  ADD_BG: "AnimTimedAddBgEvent",
  /** Updates a displayed background sprite */
  UPDATE_BG: "AnimTimedUpdateBgEvent",
} as const;

export type AnimTimedEventType = (typeof AnimTimedEventType)[keyof typeof AnimTimedEventType];
