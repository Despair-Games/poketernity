import { EggEventType } from "#enums/egg-event-type";

/**
 * Container class for {@linkcode EggEventType.EGG_COUNT_CHANGED} events
 * @extends Event
 */
export class EggCountChangedEvent extends Event {
  /** The updated egg count. */
  public eggCount: number;

  constructor(eggCount: number) {
    super(EggEventType.EGG_COUNT_CHANGED);
    this.eggCount = eggCount;
  }
}
