// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { EventModifierType } from "#enums/event-modifier-type";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

export interface EventBanner {
  key: string;
  availableLangs?: string[];
  showTimer?: boolean;
  xOffset?: number;
  yOffset?: number;
}

interface EventModifiers {
  /** Multiplier for the chance to encounter shinies in the wild. */
  wildShinyMultiplier?: number;
  /** Multiplier for the candy friendship gained by Pokemon in classic mode. */
  classicCandyFriendshipMultiplier?: number;
  /**
   * Whether to enable event-specific rewards for trainer battles.
   * TODO: the rewards should be defined here, in the event itself, not in the trainer configuration
   */
  specialBattleRewards?: boolean;
}

export interface TimedEvent {
  name: string;
  startDate: Date;
  endDate: Date;
  banner?: EventBanner;
  modifiers?: EventModifiers;
}
