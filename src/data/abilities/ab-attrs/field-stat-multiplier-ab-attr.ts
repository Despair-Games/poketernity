import { AbAttr } from "#abilities/ab-attr";
import type { AbilityId } from "#enums/ability-id";
import type { EffectiveStat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";

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

  /**
   * Multiplies the given stat value by this attribute's multiplier
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @param stat The {@linkcode EffectiveStat} being checked
   * @param statValue {@linkcode NumberHolder} the value of the checked stat
   * @param target The {@linkcode Pokemon} to which the ability may apply
   * @param hasApplied {@linkcode BooleanHolder} whether or not another multiplier has been applied to this stat
   */
  public override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _stat: EffectiveStat,
    statValue: ValueHolder<number>,
    _target: Pokemon,
    abilitiesApplied: Set<AbilityId>,
  ): void {
    statValue.value *= this.multiplier;
    abilitiesApplied.add(this.source.id);
  }

  public override canApply(...[pokemon, , stat, , target, abilitiesApplied]: Parameters<this["apply"]>): boolean {
    return stat === this.stat && this.targetCondition({ pokemon, target, abilitiesApplied });
  }
}
