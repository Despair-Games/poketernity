import type { SpeciesFormChangeTrigger } from "#app/data/species-form-change-triggers/species-form-change-trigger";
import type { Pokemon } from "#app/field/pokemon";
import type { AbstractConstructor } from "#app/utils";

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
    return !!this.triggers.find((t) => t.hasTriggerType(triggerType));
  }
}
