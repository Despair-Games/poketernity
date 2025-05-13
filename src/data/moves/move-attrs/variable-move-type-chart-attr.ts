import type { ElementalType } from "#enums/elemental-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveAttr } from "#moves/move-attr";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Attribute for moves which have a custom type chart interaction.
 * @extends MoveAttr
 */
export abstract class VariableMoveTypeChartAttr extends MoveAttr {
  /**
   * Modifies the given move's type effectiveness multiplier
   * @param _user {@linkcode Pokemon} using the move
   * @param _target {@linkcode Pokemon} target of the move
   * @param _move {@linkcode Move} with this attribute
   * @param _multiplier {@linkcode NumberHolder} holding the type effectiveness
   * @param _defType A single defensive type of the target
   * @returns true if application of the attribute succeeds
   */
  override apply(
    _user: Pokemon | null,
    _target: Pokemon | null,
    _move: Move,
    _multiplier: NumberHolder,
    _defType: ElementalType,
  ): boolean {
    return false;
  }
}
