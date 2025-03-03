import type { Move } from "#app/data/moves/move";
import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { AbAttr } from "./ab-attr";

export class MoveAbilityBypassAbAttr extends AbAttr {
  private readonly moveIgnoreFunc: (pokemon: Pokemon, move: Move) => boolean;

  constructor(moveIgnoreFunc?: (pokemon: Pokemon, move: Move) => boolean) {
    super(false);
    this._flags.add(AbAttrFlag.MOVE_ABILITY_BYPASS);

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
