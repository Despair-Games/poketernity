import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { MoveAttr } from "#app/data/move-attrs/move-attr";

export class HighCritAttr extends MoveAttr {
  override apply(_user: Pokemon, _target: Pokemon, _move: Move, critStage: NumberHolder): boolean {
    critStage.value++;
    return true;
  }

  override getUserBenefitScore(_user: Pokemon, _target: Pokemon, _move: Move): number {
    return 3;
  }
}
