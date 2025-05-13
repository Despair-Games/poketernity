import { globalScene } from "#app/global-scene";
import type { TimeOfDay } from "#enums/time-of-day";
import type { Pokemon } from "#field/pokemon";
import { SpeciesFormChangeTrigger } from "#form-change-triggers/species-form-change-trigger";

export class SpeciesFormChangeTimeOfDayTrigger extends SpeciesFormChangeTrigger {
  public timesOfDay: TimeOfDay[];

  constructor(...timesOfDay: TimeOfDay[]) {
    super();
    this.timesOfDay = timesOfDay;
  }

  override canChange(_pokemon: Pokemon): boolean {
    return globalScene.arena.isTimeOfDay(this.timesOfDay);
  }
}
