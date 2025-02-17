import type { EventType } from "#enums/event-type";

export interface EventBanner {
  key: string;
  availableLangs?: string[];
  showTimer?: boolean;
  xOffset?: number;
  yOffset?: number;
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
