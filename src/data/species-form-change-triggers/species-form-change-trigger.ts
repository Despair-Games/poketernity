import type { Pokemon } from "#app/field/pokemon";
import type { AbstractConstructor } from "#app/@types/AbstractConstructor";

export abstract class SpeciesFormChangeTrigger {
  canChange(_pokemon: Pokemon): boolean {
    return true;
  }

  hasTriggerType(triggerType: AbstractConstructor<SpeciesFormChangeTrigger>): boolean {
    return this instanceof triggerType;
  }
}
