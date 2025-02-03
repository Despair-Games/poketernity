import { EventType } from "#enums/event-type";
import type { TimedEvent } from "#app/@types/TimedEvent";

const timedEvents: TimedEvent[] = [
  {
    name: "Halloween Update",
    eventType: EventType.SHINY,
    shinyMultiplier: 2,
    friendshipMultiplier: 2,
    startDate: new Date(Date.UTC(2024, 9, 27, 0)),
    endDate: new Date(Date.UTC(2025, 10, 4, 0)),
    bannerKey: "halloween2024-event-",
    scale: 0.21,
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
