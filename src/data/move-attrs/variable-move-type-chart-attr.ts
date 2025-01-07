import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/move";
import { MoveAttr } from "#app/data/move-attrs/move-attr";
import type { NumberHolder } from "#app/utils";
import type { Type } from "#enums/type";

/**
 * Attribute for moves which have a custom type chart interaction.
 * @extends MoveAttr
 */
export class VariableMoveTypeChartAttr extends MoveAttr {
  /**
   * Modifies the given move's type effectiveness multiplier
   * @param _user {@linkcode Pokemon} using the move
   * @param _target {@linkcode Pokemon} target of the move
   * @param _move {@linkcode Move} with this attribute
   * @param _multiplier {@linkcode NumberHolder} holding the type effectiveness
   * @param _defType A single defensive type of the target
   * @returns true if application of the attribute succeeds
   */
  override apply(_user: Pokemon, _target: Pokemon, _move: Move, _multiplier: NumberHolder, _defType: Type): boolean {
    return false;
  }
}
