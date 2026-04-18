import { TypeImmunityAbAttr } from "#abilities/type-immunity-ab-attr";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { ElementalType } from "#enums/elemental-type";
import type { TypeImmunityAbAttrParams } from "#types/ab-attr-param-types";
import type { AbAttrCondition } from "#types/ability-types";

export class TypeImmunityAddBattlerTagAbAttr extends TypeImmunityAbAttr {
  private readonly tagType: BattlerTagType;
  private readonly turnCount: number;

  constructor(immuneType: ElementalType, tagType: BattlerTagType, turnCount: number, condition?: AbAttrCondition) {
    super(immuneType, condition);

    this.tagType = tagType;
    this.turnCount = turnCount;
  }

  public override apply(params: TypeImmunityAbAttrParams): void {
    const { simulated, pokemon } = params;
    super.apply(params);
    if (!simulated) {
      pokemon.addTag(this.tagType, this.turnCount, undefined, pokemon.id);
    }
  }

  // The added battler tag supplies the trigger message instead
  public override getTriggerMessage(): string | null {
    return null;
  }
}
