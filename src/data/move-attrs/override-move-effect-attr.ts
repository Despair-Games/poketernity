import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/move";
import { MoveAttr } from "#app/data/move-attrs/move-attr";
import type { BooleanHolder } from "#app/utils";

export class OverrideMoveEffectAttr extends MoveAttr {
  /**
   * Applies effects that may cancel the subsequent effect
   * chain in {@linkcode MoveEffectPhase}
   * @param _user the {@linkcode Pokemon} using the move
   * @param _target the {@linkcode Pokemon} targeted by the move
   * @param _move the {@linkcode Move} being used
   * @param _overridden a {@linkcode BooleanHolder} which, if set to `true`, cancels the normal
   * effect chain in {@linkcode MoveEffectPhase}
   * @param _virtual `true` if the move is invoked virtually (e.g. the attack phase of Future Sight)
   * @returns `true` if this applied overriding effects
   */
  override apply(
    _user: Pokemon,
    _target: Pokemon,
    _move: Move,
    _overridden: BooleanHolder,
    _virtual: boolean,
  ): boolean {
    return true;
  }
}
