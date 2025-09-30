import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
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
  private readonly stat: EffectiveStat;
  private readonly multiplier: number;
  /** A condition the target must satisfy to be affected by this attribute */
  private readonly targetCondition: TargetCondition;

  constructor(stat: EffectiveStat, multiplier: number, targetCondition: TargetCondition = () => true) {
    super(false);
    this._flags.add(AbAttrFlag.FIELD_STAT_MULTIPLIER);

    this.stat = stat;
    this.multiplier = multiplier;
    this.targetCondition = targetCondition;
  }

  /**
   * Tries to multiply a Pokemon's Stat
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @param stat The {@linkcode Stat} being checked
   * @param statValue {@linkcode NumberHolder} the value of the checked stat
   * @param target The {@linkcode Pokemon} to which the ability may apply
   * @param hasApplied {@linkcode BooleanHolder} whether or not another multiplier has been applied to this stat
   * @returns `true` if this changed the checked stat, `false` otherwise.
   */
  public override apply(
    pokemon: Pokemon,
    _simulated: boolean,
    stat: EffectiveStat,
    statValue: ValueHolder<number>,
    target: Pokemon,
    abilitiesApplied: Set<AbilityId>,
  ): boolean {
    if (stat === this.stat && this.targetCondition({ pokemon, target, abilitiesApplied })) {
      statValue.value *= this.multiplier;
      abilitiesApplied.add(this.source.id);
      return true;
    }
    return false;
  }
}
