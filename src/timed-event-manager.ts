import { EventType } from "#enums/event-type";
import type { EventBanner, TimedEvent } from "#app/@types/TimedEvent";

const timedEvents: TimedEvent[] = [
  {
    name: "Welcome to Pokéternity",
    eventType: EventType.NO_TIMER_DISPLAY,
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
/*function isUpcoming(event: TimedEvent) {
  return event.startDate >= new Date();
}*/
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
  getActiveOrUpcomingEventBanner(): EventBanner | undefined {
    return this.events.find((te: TimedEvent) => isActiveOrUpcoming(te) && te.banner)?.banner;
  }

  activeEvent(): TimedEvent | undefined {
    return this.events.find((te: TimedEvent) => isActive(te));
  }

  isEventActive(): boolean {
    return this.events.some((te: TimedEvent) => isActive(te));
  }

  activeEventHasBanner(): boolean {
    const activeEvents = this.events.filter((te) => isActive(te) && te.hasOwnProperty("bannerFilename"));
    return activeEvents.length > 0;
  }

  getFriendshipMultiplier(): number {
    let multiplier = 1;
    const friendshipEvents = this.events.filter((te) => isActive(te));
    friendshipEvents.forEach((fe) => {
      multiplier *= fe.friendshipMultiplier ?? 1;
    });

    return multiplier;
  }

  getShinyMultiplier(): number {
    let multiplier = 1;
    const shinyEvents = this.events.filter((te) => te.eventType === EventType.SHINY && isActive(te));
    shinyEvents.forEach((se) => {
      multiplier *= se.shinyMultiplier ?? 1;
    });

    return multiplier;
  }
}

/**
 * Singleton instance of {@linkcode TimedEventManager}.
 */
export const eventManager = new TimedEventManager();
