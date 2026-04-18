import { AbAttr } from "#abilities/ab-attr";
import type { AbilityId } from "#enums/ability-id";
import type { EffectiveStat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import type { FieldStatMultiplierAbAttrParams } from "#types/ab-attr-param-types";
import type { Exact } from "#types/utility-types";

type TargetCondition = (params: { pokemon: Pokemon; target: Pokemon; abilitiesApplied: Set<AbilityId> }) => boolean;

/**
 * Attribute to multiply an {@linkcode EffectiveStat} of any Pokemon on the field,
 * provided they meet set conditions.
 */
export class FieldStatMultiplierAbAttr extends AbAttr {
  protected override readonly abAttrKey = "FieldStatMultiplierAbAttr";
  private readonly stat: EffectiveStat;
  private readonly multiplier: number;
  /** A condition the target must satisfy to be affected by this attribute */
  private readonly targetCondition: TargetCondition;

  constructor(stat: EffectiveStat, multiplier: number, targetCondition: TargetCondition = () => true) {
    super(false);

    this.stat = stat;
    this.multiplier = multiplier;
    this.targetCondition = targetCondition;
  }

  public override apply({ statValue, abilitiesApplied }: FieldStatMultiplierAbAttrParams): void {
    statValue.value *= this.multiplier;
    abilitiesApplied.add(this.source.id);
  }

  public override canApply({ pokemon, stat, target, abilitiesApplied }: Exact<Parameters<this["apply"]>[0]>): boolean {
    return stat === this.stat && this.targetCondition({ pokemon, target, abilitiesApplied });
  }
}
