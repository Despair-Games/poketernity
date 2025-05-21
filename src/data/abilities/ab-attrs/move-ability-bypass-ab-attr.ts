import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { BooleanHolder } from "#utils/common-utils";

export class MoveAbilityBypassAbAttr extends AbAttr {
  private readonly moveIgnoreFunc: (pokemon: Pokemon, move: Move) => boolean;

  constructor(moveIgnoreFunc?: (pokemon: Pokemon, move: Move) => boolean) {
    super(false);
    this._flags.add(AbAttrFlag.MOVE_ABILITY_BYPASS);

    this.moveIgnoreFunc = moveIgnoreFunc ?? ((_pokemon, _move) => true);
  }

  public override apply(pokemon: Pokemon, _simulated: boolean, cancelled: BooleanHolder, move: Move): boolean {
    if (this.moveIgnoreFunc(pokemon, move)) {
      cancelled.value = true;
      return true;
    }
    return false;
  }
}
