import type Pokemon from "#app/field/pokemon";
import type { BooleanHolder, NumberHolder } from "#app/utils";
import type { Stat } from "#enums/stat";
import { AbAttr } from "./ab-attr";

/**
 * Multiplies a Stat if the checked Pokemon lacks this ability.
 * If this ability cannot stack, a BooleanHolder can be used to prevent this from stacking.
 * @see {@link applyFieldStatMultiplierAbAttrs}
 * @see {@link applyFieldStat}
 * @see {@link BooleanHolder}
 */

export class FieldMultiplyStatAbAttr extends AbAttr {
  private stat: Stat;
  private multiplier: number;
  private canStack: boolean;

  constructor(stat: Stat, multiplier: number, canStack: boolean = false) {
    super(false);

    this.stat = stat;
    this.multiplier = multiplier;
    this.canStack = canStack;
  }

  /**
   * applyFieldStat: Tries to multiply a Pokemon's Stat
   * @param _pokemon {@linkcode Pokemon} the Pokemon using this ability
   * @param _passive {@linkcode boolean} unused
   * @param stat {@linkcode Stat} the type of the checked stat
   * @param statValue {@linkcode NumberHolder} the value of the checked stat
   * @param checkedPokemon {@linkcode Pokemon} the Pokemon this ability is targeting
   * @param hasApplied {@linkcode BooleanHolder} whether or not another multiplier has been applied to this stat
   * @param _args {any[]} unused
   * @returns true if this changed the checked stat, false otherwise.
   */
  applyFieldStat(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    stat: Stat,
    statValue: NumberHolder,
    checkedPokemon: Pokemon,
    hasApplied: BooleanHolder,
    _args: any[],
  ): boolean {
    if (!this.canStack && hasApplied.value) {
      return false;
    }

    if (
      this.stat === stat
      && checkedPokemon
        .getAbilityAttrs(FieldMultiplyStatAbAttr)
        .every((attr) => (attr as FieldMultiplyStatAbAttr).stat !== stat)
    ) {
      statValue.value *= this.multiplier;
      hasApplied.value = true;
      return true;
    }
    return false;
  }
}
