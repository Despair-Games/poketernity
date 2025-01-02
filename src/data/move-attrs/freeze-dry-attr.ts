import { Type } from "#enums/type";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableMoveTypeChartAttr } from "#app/data/move-attrs/variable-move-type-chart-attr";

/**
 * Attribute to make a move super effective against the Water type.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Freeze-Dry_(move) Freeze-Dry}.
 * @extends VariableMoveTypeChartAttr
 */
export class FreezeDryAttr extends VariableMoveTypeChartAttr {
  override apply(_user: Pokemon, _target: Pokemon, _move: Move, multiplier: NumberHolder, defType: Type): boolean {
    if (defType === Type.WATER) {
      multiplier.value = 2;
      return true;
    } else {
      return false;
    }
  }
}
