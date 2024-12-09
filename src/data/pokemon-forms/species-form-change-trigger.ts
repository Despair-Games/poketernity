import type Pokemon from "#app/field/pokemon";
import type { Constructor } from "#app/utils";

export abstract class SpeciesFormChangeTrigger {
  canChange(_pokemon: Pokemon): boolean {
    return true;
  }

  hasTriggerType(triggerType: Constructor<SpeciesFormChangeTrigger>): boolean {
    return this instanceof triggerType;
  }
}
