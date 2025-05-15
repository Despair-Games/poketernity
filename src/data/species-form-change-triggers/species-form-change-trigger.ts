import type { AbstractConstructor } from "#app/@types/abstract-constructor";
import type { Pokemon } from "#field/pokemon";

export abstract class SpeciesFormChangeTrigger {
  canChange(_pokemon: Pokemon): boolean {
    return true;
  }

  hasTriggerType(triggerType: AbstractConstructor<SpeciesFormChangeTrigger>): boolean {
    return this instanceof triggerType;
  }
}
