import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder, NumberHolder } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Stat } from "#enums/stat";
import { AbAttr } from "./ab-attr";

/**
 * Multiplies a Stat if the checked Pokemon lacks this ability.
 * If this ability cannot stack, a BooleanHolder can be used to prevent this from stacking.
 * @see {@link applyAbAttrs}
 */
export class FieldMultiplyStatAbAttr extends AbAttr {
  private readonly stat: Stat;
  private readonly multiplier: number;
  private readonly canStack: boolean;

  constructor(stat: Stat, multiplier: number, canStack: boolean = false) {
    super(false);
    this._flags.add(AbAttrFlag.FIELD_MULTIPLY_STAT);

    this.stat = stat;
    this.multiplier = multiplier;
    this.canStack = canStack;
  }

  /**
   * Tries to multiply a Pokemon's Stat
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @param stat The {@linkcode Stat} being checked
   * @param statValue {@linkcode NumberHolder} the value of the checked stat
   * @param checkedPokemon The {@linkcode Pokemon} this ability is targeting
   * @param hasApplied {@linkcode BooleanHolder} whether or not another multiplier has been applied to this stat
   * @returns `true` if this changed the checked stat, `false` otherwise.
   */
  override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    stat: Stat,
    statValue: NumberHolder,
    checkedPokemon: Pokemon,
    hasApplied: BooleanHolder,
  ): boolean {
    if (!this.canStack && hasApplied.value) {
      return false;
    }

    if (
      this.stat === stat
      && checkedPokemon
        .getAbilityAttrs(AbAttrFlag.FIELD_MULTIPLY_STAT)
        .every((attr) => (attr as FieldMultiplyStatAbAttr).stat !== stat)
    ) {
      statValue.value *= this.multiplier;
      hasApplied.value = true;
      return true;
    }
    return false;
  }
}
