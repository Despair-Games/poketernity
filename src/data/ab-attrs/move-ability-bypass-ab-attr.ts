import type Move from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import { AbAttr } from "./ab-attr";

export class MoveAbilityBypassAbAttr extends AbAttr {
  private readonly moveIgnoreFunc: (pokemon: Pokemon, move: Move) => boolean;

  constructor(moveIgnoreFunc?: (pokemon: Pokemon, move: Move) => boolean) {
    super(false);

    this.moveIgnoreFunc = moveIgnoreFunc ?? ((_pokemon, _move) => true);
  }

  override apply(
    pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    const move: Move = args[0];
    if (this.moveIgnoreFunc(pokemon, move)) {
      cancelled.value = true;
      return true;
    }
    return false;
  }
}
