import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { MoveAttr } from "#app/data/move-attrs/move-attr";

export class IgnoreOpponentStatStagesAttr extends MoveAttr {
  override apply(_user: Pokemon, _target: Pokemon, _move: Move, args: any[]): boolean {
    (args[0] as BooleanHolder).value = true;

    return true;
  }
}
