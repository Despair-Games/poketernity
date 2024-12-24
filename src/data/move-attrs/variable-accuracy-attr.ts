import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/move";
import { MoveAttr } from "#app/data/move-attrs/move-attr";

export class VariableAccuracyAttr extends MoveAttr {
  override apply(_user: Pokemon, _target: Pokemon, _move: Move, _args: any[]): boolean {
    //const accuracy = args[0] as Utils.NumberHolder;
    return false;
  }
}
