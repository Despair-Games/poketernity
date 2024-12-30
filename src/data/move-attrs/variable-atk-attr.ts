import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/move";
import { MoveAttr } from "#app/data/move-attrs/move-attr";
import type { NumberHolder } from "#app/utils";

export class VariableAtkAttr extends MoveAttr {
  constructor() {
    super();
  }

  override apply(_user: Pokemon, _target: Pokemon, _move: Move, _attackingStat: NumberHolder): boolean {
    return false;
  }
}
