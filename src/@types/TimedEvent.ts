import type { EventType } from "#enums/event-type";

interface EventBanner {
  bannerKey?: string;
  xOffset?: number;
  yOffset?: number;
  scale?: number;
  availableLangs?: string[];
}

export interface TimedEvent extends EventBanner {
  name: string;
  eventType: EventType;
  shinyMultiplier?: number;
  friendshipMultiplier?: number;
  startDate: Date;
  endDate: Date;
}
