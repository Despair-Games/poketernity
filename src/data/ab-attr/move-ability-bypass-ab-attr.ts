import type Pokemon from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import type Move from "../move";
import { AbAttr } from "./ab-attr";

export class MoveAbilityBypassAbAttr extends AbAttr {
  private moveIgnoreFunc: (pokemon: Pokemon, move: Move) => boolean;

  constructor(moveIgnoreFunc?: (pokemon: Pokemon, move: Move) => boolean) {
    super(false);

    this.moveIgnoreFunc = moveIgnoreFunc || ((_pokemon, _move) => true);
  }

  override apply(
    pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    if (this.moveIgnoreFunc(pokemon, args[0] as Move)) {
      cancelled.value = true;
      return true;
    }
    return false;
  }
}
