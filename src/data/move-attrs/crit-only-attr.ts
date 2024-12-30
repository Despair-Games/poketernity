import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { MoveAttr } from "#app/data/move-attrs/move-attr";

export class CritOnlyAttr extends MoveAttr {
  override apply(_user: Pokemon, _target: Pokemon, _move: Move, isCritical: BooleanHolder): boolean {
    isCritical.value = true;

    return true;
  }

  override getUserBenefitScore(_user: Pokemon, _target: Pokemon, _move: Move): number {
    return 5;
  }
}
