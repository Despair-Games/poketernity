import { Type } from "#enums/type";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableMoveTypeChartAttr } from "#app/data/move-attrs/variable-move-type-chart-attr";

/**
 * This class forces Freeze-Dry to be super effective against Water Type.
 */
export class FreezeDryAttr extends VariableMoveTypeChartAttr {
  /** Modifies the move's type chart to be super effective against {@linkcode Type.WATER Water} */
  override apply(_user: Pokemon, _target: Pokemon, _move: Move, multiplier: NumberHolder, defType: Type): boolean {
    if (defType === Type.WATER) {
      multiplier.value = 2;
      return true;
    } else {
      return false;
    }
  }
}
