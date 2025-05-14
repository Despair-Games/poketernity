import { ElementalType } from "#enums/elemental-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { VariableMoveTypeChartAttr } from "#moves/variable-move-type-chart-attr";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Attribute to make a move super effective against the Water type.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Freeze-Dry_(move) | Freeze-Dry}.
 * @extends VariableMoveTypeChartAttr
 */
export class FreezeDryAttr extends VariableMoveTypeChartAttr {
  override apply(
    _user: Pokemon,
    _target: Pokemon,
    _move: Move,
    multiplier: NumberHolder,
    defType: ElementalType,
  ): boolean {
    if (defType === ElementalType.WATER) {
      multiplier.value = 2;
      return true;
    } else {
      return false;
    }
  }
}
