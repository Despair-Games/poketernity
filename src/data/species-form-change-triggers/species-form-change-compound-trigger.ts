import type { Pokemon } from "#field/pokemon";
import type { SpeciesFormChangeTrigger } from "#form-change-triggers/species-form-change-trigger";
import type { AbstractConstructor } from "#types/AbstractConstructor";

export class SpeciesFormChangeCompoundTrigger {
  public triggers: SpeciesFormChangeTrigger[];

  constructor(...triggers: SpeciesFormChangeTrigger[]) {
    this.triggers = triggers;
  }

  canChange(pokemon: Pokemon): boolean {
    for (const trigger of this.triggers) {
      if (!trigger.canChange(pokemon)) {
        return false;
      }
    }

    return true;
  }

  hasTriggerType(triggerType: AbstractConstructor<SpeciesFormChangeTrigger>): boolean {
    return this.triggers.some((t) => t.hasTriggerType(triggerType));
  }
}
