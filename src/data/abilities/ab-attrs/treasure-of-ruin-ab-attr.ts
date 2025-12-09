import { FieldStatMultiplierAbAttr } from "#abilities/field-stat-multiplier-ab-attr";
import type { EffectiveStat } from "#enums/stat";

export class TreasureOfRuinAbAttr extends FieldStatMultiplierAbAttr {
  constructor(stat: EffectiveStat) {
    super(
      stat,
      0.75,
      ({ target, abilitiesApplied }) =>
        !abilitiesApplied.has(this.source.id)
        && !target.getAbilityAttrs("FieldStatMultiplierAbAttr").some((attr) => attr.source.id === this.source.id),
    );
  }
}
