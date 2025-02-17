import type { EventBanner, TimedEvent } from "#app/@types/TimedEvent";
import type { EventModifierType } from "#enums/event-modifier-type";

/** Mock TimedEventManager so that ongoing events don't impact tests */
export class MockTimedEventManager {
  private events: TimedEvent[];

  private getActiveEvents(): TimedEvent[] {
    return [];
  }

  public getActiveOrUpcomingEventBanner(): EventBanner | undefined {
    return undefined;
  }
  public getActiveEvent(_bannerOnly?: boolean): TimedEvent | undefined {
    return undefined;
  }
  public isEventActive(_modifier: EventModifierType): boolean {
    return false;
  }
  public getClassicCandyFriendshipMultiplier(): number {
    return 1;
  }
  public getWildShinyChanceMultiplier(): number {
    return 1;
  }
}
