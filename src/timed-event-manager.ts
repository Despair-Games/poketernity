import type { EventBanner, TimedEvent } from "#app/@types/TimedEvent";
import { allTimedEvents } from "#app/data/all-timed-events";
import { EventModifierType } from "#enums/event-modifier-type";
import { isNullOrUndefined } from "#app/utils";

function isActive(event: TimedEvent) {
  return event.startDate < new Date() && new Date() < event.endDate;
}

function isActiveOrUpcoming(event: TimedEvent) {
  return new Date() < event.endDate;
}

class TimedEventManager {
  private events: TimedEvent[];

  constructor(events: TimedEvent[]) {
    this.setEvents(events);
  }

  private setEvents(events: TimedEvent[]) {
    // Filter out any expired event from the list or events with invalid start and end dates
    this.events = events.filter((te: TimedEvent) => {
      if (te.endDate <= te.startDate) {
        console.warn(`Invalid start and end dates for event ${te.name}. Ignoring.`);
        return false;
      }
      return isActiveOrUpcoming(te);
    });
    // Sort so that active events appear before upcoming ones
    this.events.sort((event1, event2) => event1.startDate.getTime() - event2.startDate.getTime());
  }

  /**
   * Get the banner information for the current or next upcoming event with a banner.
   * @returns the current or next {@linkcode EventBanner}, if any.
   */
  public getActiveOrNextEventBanner(): EventBanner | undefined {
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
export const timedEventManager = new TimedEventManager(allTimedEvents);
