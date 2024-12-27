import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/move";
import { MoveAttr } from "#app/data/move-attrs/move-attr";

/**
 * Attribute for moves which have a custom type chart interaction.
 */
export class VariableMoveTypeChartAttr extends MoveAttr {
  /**
   * @param _user {@linkcode Pokemon} using the move
   * @param _target {@linkcode Pokemon} target of the move
   * @param _move {@linkcode Move} with this attribute
   * @param _args [0] {@linkcode NumberHolder} holding the type effectiveness
   * @param _args [1] A single defensive type of the target
   *
   * @returns true if application of the attribute succeeds
   */
  override apply(_user: Pokemon, _target: Pokemon, _move: Move, _args: any[]): boolean {
    return false;
  }
}
