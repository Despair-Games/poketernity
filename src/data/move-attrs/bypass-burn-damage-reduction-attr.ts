import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { MoveAttr } from "#app/data/move-attrs/move-attr";

/**
 * Attribute used for moves that bypass the burn damage reduction of physical moves, currently only facade
 * Called during damage calculation
 * @extends MoveAttr
 * @see {@linkcode apply}
 */
export class BypassBurnDamageReductionAttr extends MoveAttr {
  /** Prevents the move's damage from being reduced by burn
   * @param _user N/A
   * @param _target N/A
   * @param _move {@linkcode Move} with this attribute
   * @param burnDamageReductionCancelled set to `true` to disable the damage penalty from Burn
   * @returns true if the function succeeds
   */
  override apply(_user: Pokemon, _target: Pokemon, _move: Move, burnDamageReductionCancelled: BooleanHolder): boolean {
    burnDamageReductionCancelled.value = true;
    return true;
  }
}
