import { EventType } from "#enums/event-type";
import type { TimedEvent } from "#app/@types/TimedEvent";

const timedEvents: TimedEvent[] = [
  {
    name: "Welcome to Pokéternity",
    eventType: EventType.NO_TIMER_DISPLAY,
    startDate: new Date(Date.UTC(2025, 0, 1, 0)),
    endDate: new Date(Date.UTC(2025, 5, 30, 0)),
    bannerKey: "welcome-",
  },
];

class TimedEventManager {
  constructor() {}

  isActive(event: TimedEvent) {
    return event.startDate < new Date() && new Date() < event.endDate;
  }

  activeEvent(): TimedEvent | undefined {
    return timedEvents.find((te: TimedEvent) => this.isActive(te));
  }

  isEventActive(): boolean {
    return timedEvents.some((te: TimedEvent) => this.isActive(te));
  }

  activeEventHasBanner(): boolean {
    const activeEvents = timedEvents.filter((te) => this.isActive(te) && te.hasOwnProperty("bannerFilename"));
    return activeEvents.length > 0;
  }

  getFriendshipMultiplier(): number {
    let multiplier = 1;
    const friendshipEvents = timedEvents.filter((te) => this.isActive(te));
    friendshipEvents.forEach((fe) => {
      multiplier *= fe.friendshipMultiplier ?? 1;
    });

    return multiplier;
  }

  getShinyMultiplier(): number {
    let multiplier = 1;
    const shinyEvents = timedEvents.filter((te) => te.eventType === EventType.SHINY && this.isActive(te));
    shinyEvents.forEach((se) => {
      multiplier *= se.shinyMultiplier ?? 1;
    });

    return multiplier;
  }

  getEventBannerFilename(): string {
    return timedEvents.find((te: TimedEvent) => this.isActive(te))?.bannerKey ?? "";
  }
}

/**
 * Singleton instance of {@linkcode TimedEventManager}
 */
export const eventManager = new TimedEventManager();
