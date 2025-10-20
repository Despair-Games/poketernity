import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { ValueHolder } from "#utils/common-utils";

export class MoveAbilityBypassAbAttr extends AbAttr {
  private readonly moveIgnoreFunc: (pokemon: Pokemon, move: Move) => boolean;

  constructor(moveIgnoreFunc: (pokemon: Pokemon, move: Move) => boolean = () => true) {
    super(false);
    this._flags.add(AbAttrFlag.MOVE_ABILITY_BYPASS);

    this.moveIgnoreFunc = moveIgnoreFunc;
  }

  public override apply(_pokemon: Pokemon, _simulated: boolean, cancelled: ValueHolder<boolean>, _move: Move): void {
    cancelled.value = true;
  }

  public override canApply(...[pokemon, , , move]: Parameters<this["apply"]>): boolean {
    return this.moveIgnoreFunc(pokemon, move);
  }
}
