// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { SupportedLanguage } from "#app/@types/Language";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

export interface EventBanner {
  /** The base filename of the banner (without any language key or the extension). e.g. `welcome-event` */
  key: string;
  /**
   * The keys of all {@linkcode SupportedLanguage}s with their own banner for the event.
   * The banner images should be of form `{bannerKey}_{languageKey}.png`, e.g. `welcome-event_zh-CW.png`.
   * "en" should always be part of it. If the banner isn't localized at all, this should be undefined.
   */
  availableLangs?: string[];
  /** Whether to show the time before the end of the event below the banner. */
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
