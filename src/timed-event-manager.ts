import { EventModifierType } from "#enums/event-modifier-type";
import type { EventBanner, TimedEvent } from "#app/@types/TimedEvent";
import { isNullOrUndefined } from "#app/utils";

const timedEvents: TimedEvent[] = [
  {
    name: "Welcome to Pokéternity",
    startDate: new Date(Date.UTC(2025, 0, 1, 0)),
    endDate: new Date(Date.UTC(2025, 5, 30, 0)),
    banner: {
      key: "welcome",
      availableLangs: ["en", "fr"],
    },
  },
];

function isActive(event: TimedEvent) {
  return event.startDate < new Date() && new Date() < event.endDate;
}

function isActiveOrUpcoming(event: TimedEvent) {
  return event.startDate >= new Date() || new Date() < event.endDate;
}

class TimedEventManager {
  private events: TimedEvent[];

  constructor() {
    // Filter out any expired event from the global event list
    this.events = timedEvents.filter((te: TimedEvent) => te.endDate >= new Date());
    // Sort so that active events appear before upcoming events
    this.events.sort((event1, event2) => event2.startDate.getDate() - event1.startDate.getDate());
  }

  /**
   * Get the banner information for the current or next upcoming event with a banner.
   * @returns the current or next {@linkcode EventBanner}, if any.
   */
  public getActiveOrUpcomingEventBanner(): EventBanner | undefined {
    return this.events.find((te: TimedEvent) => isActiveOrUpcoming(te) && te.banner)?.banner;
  }

  /**
   * Get the current active event, if any.
   * @param bannerOnly set to `true` to only retrieve events with a banner.
   * @returns the current {@linkcode TimedEvent}, or `undefined`
   */
  public getActiveEvent(bannerOnly?: boolean): TimedEvent | undefined {
    return this.events.find((te: TimedEvent) => isActive(te) && (!bannerOnly || te.banner));
  }

  /**
   * Check if an event with the given effect is active.
   * @param modifier the {@linkcode EventModifierType} to check for
   * @returns `true` if at least one active event has the required elements for the given modifier, `false` otherwise
   */
  public isEventActive(modifier: EventModifierType): boolean {
    switch (modifier) {
      case EventModifierType.WILD_SHINY_CHANCE:
        return this.events.some(
          (te: TimedEvent) => isActive(te) && !isNullOrUndefined(te.modifiers?.wildShinyMultiplier),
        );
      case EventModifierType.CLASSIC_CANDY_FRIENDSHIP_MULTIPLIER:
        return this.events.some(
          (te: TimedEvent) => isActive(te) && !isNullOrUndefined(te.modifiers?.classicCandyFriendshipMultiplier),
        );
      case EventModifierType.EXTRA_TRAINER_REWARDS:
        return this.events.some((te: TimedEvent) => isActive(te) && te.modifiers?.specialBattleRewards);
    }
  }

  private getActiveEvents(): TimedEvent[] {
    return this.events.filter((te) => isActive(te));
  }

  public getClassicCandyFriendshipMultiplier(): number {
    let multiplier = 1;
    this.getActiveEvents().forEach((event) => {
      multiplier *= event.modifiers?.classicCandyFriendshipMultiplier ?? 1;
    });
    return multiplier;
  }

  public getWildShinyChanceMultiplier(): number {
    let multiplier = 1;
    this.getActiveEvents().forEach((event) => {
      multiplier *= event.modifiers?.wildShinyMultiplier ?? 1;
    });
    return multiplier;
  }
}

/**
 * Singleton instance of {@linkcode TimedEventManager}.
 */
export const eventManager = new TimedEventManager();
