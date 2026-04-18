import { TypeImmunityAbAttr } from "#abilities/type-immunity-ab-attr";
import { globalScene } from "#app/global-scene";
import type { ElementalType } from "#enums/elemental-type";
import type { BattleStat } from "#enums/stat";
import type { TypeImmunityAbAttrParams } from "#types/ab-attr-param-types";
import type { AbAttrCondition } from "#types/ability-types";

export class TypeImmunityStatStageChangeAbAttr extends TypeImmunityAbAttr {
  private readonly stat: BattleStat;
  private readonly stages: number;

  constructor(immuneType: ElementalType, stat: BattleStat, stages: number, condition?: AbAttrCondition) {
    super(immuneType, condition);

    this.stat = stat;
    this.stages = stages;
  }

  public override apply(params: TypeImmunityAbAttrParams): void {
    super.apply(params);
    const { simulated, pokemon } = params;
    if (!simulated) {
      globalScene.phaseManager.createAndUnshiftPhase(
        "StatStageChangePhase",
        pokemon.getBattlerIndex(),
        pokemon,
        [this.stat],
        this.stages,
      );
    }
  }

  // The StatStageChangePhase from this effect takes the place of the default trigger message
  public override getTriggerMessage(): string | null {
    return null;
  }
}
