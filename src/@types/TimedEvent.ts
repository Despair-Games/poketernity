import type { EventType } from "#enums/event-type";

export interface EventBanner {
  key: string;
  xOffset?: number;
  yOffset?: number;
  scale?: number;
  availableLangs?: string[];
}

export interface TimedEvent {
  name: string;
  startDate: Date;
  endDate: Date;
  banner?: EventBanner;

  eventType: EventType; // TODO change
  shinyMultiplier?: number;
  friendshipMultiplier?: number;
  // TODO enable trainer rewards
}
