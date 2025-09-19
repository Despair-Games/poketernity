import { FieldMultiplyStatAbAttr } from "#abilities/field-multiply-stat-ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Stat } from "#enums/stat";

export class TreasureOfRuinAbAttr extends FieldMultiplyStatAbAttr {
  constructor(stat: Stat) {
    super(
      stat,
      0.75,
      ({ target, abilitiesApplied }) =>
        !abilitiesApplied.has(this.source.id)
        && !target.getAbilityAttrs(AbAttrFlag.FIELD_MULTIPLY_STAT).some((attr) => attr.source.id === this.source.id),
    );
  }
}
