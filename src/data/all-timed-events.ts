import type { TimedEvent } from "#app/@types/TimedEvent";

/**
 * Array of the {@linkcode TimedEvent} used in the game.
 * This should *not* be accessed directly, all event-related logic should go through the TimedEventManager.
 *
 * Note that the event manager filters for outdated events, and the loading scene only loads banner images
 * for the currently active event, or the next event if any.
 * This means it is fine to keep past events in this array even when adding new ones.
 *
 * CAUTION: All month numbers are 0-indexed (0 = January, 1 = February, etc.).
 * The year and date numbers are still 1-indexed as normal. Example: `Date.UTC(2025, 2, 15)` = March 15, 2025.
 */
export const allTimedEvents: TimedEvent[] = [
  {
    name: "Welcome to Pokéternity",
    startDate: new Date(Date.UTC(2025, 0, 1, 0)),
    endDate: new Date(Date.UTC(2025, 2, 15, 0)),
    banner: {
      key: "welcome",
      availableLangs: ["en", "fr"],
    },
  },
];
