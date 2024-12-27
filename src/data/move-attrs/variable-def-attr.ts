import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/move";
import { MoveAttr } from "#app/data/move-attrs/move-attr";

export class VariableDefAttr extends MoveAttr {
  constructor() {
    super();
  }

  override apply(_user: Pokemon, _target: Pokemon, _move: Move, _args: any[]): boolean {
    //const def = args[0] as Utils.NumberHolder;
    return false;
  }
}
