import type { TimedEvent } from "#app/@types/TimedEvent";

/** Mock TimedEventManager so that ongoing events don't impact tests */
export class MockTimedEventManager {
  isActive(_event: TimedEvent) {
    return false;
  }
  activeEvent() {
    return undefined;
  }
  isEventActive(): boolean {
    return false;
  }
  activeEventHasBanner(): boolean {
    return false;
  }
  getEventBannerFilename(): string {
    return "";
  }
  getFriendshipMultiplier(): number {
    return 1;
  }
  getShinyMultiplier(): number {
    return 1;
  }
}
