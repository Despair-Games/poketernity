import type { Pokemon } from "#field/pokemon";
import type { AbstractConstructor } from "#types/utility-types";

export abstract class SpeciesFormChangeTrigger {
  canChange(_pokemon: Pokemon): boolean {
    return true;
  }

  hasTriggerType(triggerType: AbstractConstructor<SpeciesFormChangeTrigger>): boolean {
    return this instanceof triggerType;
  }
}
