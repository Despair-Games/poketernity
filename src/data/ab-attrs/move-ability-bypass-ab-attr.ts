import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import { AbAttrId } from "#enums/ab-attr-id";
import { AbAttr } from "./ab-attr";

export class MoveAbilityBypassAbAttr extends AbAttr {
  private readonly moveIgnoreFunc: (pokemon: Pokemon, move: Move) => boolean;

  constructor(moveIgnoreFunc?: (pokemon: Pokemon, move: Move) => boolean) {
    super(false);
    this._id = AbAttrId.MOVE_ABILITY_BYPASS;

    this.moveIgnoreFunc = moveIgnoreFunc ?? ((_pokemon, _move) => true);
  }

  override apply(pokemon: Pokemon, _simulated: boolean, cancelled: BooleanHolder, move: Move): boolean {
    if (this.moveIgnoreFunc(pokemon, move)) {
      cancelled.value = true;
      return true;
    }
    return false;
  }
}
