import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/move";
import { MoveAttr } from "#app/data/move-attrs/move-attr";
import type { BooleanHolder } from "#app/utils";

export class OverrideMoveEffectAttr extends MoveAttr {
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
