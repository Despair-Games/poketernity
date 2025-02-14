import { SpeciesFormChangeTrigger } from "#app/data/species-form-change-triggers/species-form-change-trigger";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { TimeOfDay } from "#enums/time-of-day";

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
