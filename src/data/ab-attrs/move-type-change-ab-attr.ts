import type { PokemonAttackCondition } from "#app/@types/PokemonAttackCondition";
import type Pokemon from "#app/field/pokemon";
import { NumberHolder } from "#app/utils";
import type { Type } from "#enums/type";
import type Move from "../move";
import { PreAttackAbAttr } from "./pre-attack-ab-attr";

export class MoveTypeChangeAbAttr extends PreAttackAbAttr {
  constructor(
    private newType: Type,
    private powerMultiplier: number,
    private condition?: PokemonAttackCondition,
  ) {
    super(true);
  }

  // TODO: Decouple this into two attributes (type change / power boost)
  override applyPreAttack(
    pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    defender: Pokemon,
    move: Move,
    args: any[],
  ): boolean {
    if (this.condition && this.condition(pokemon, defender, move)) {
      if (args[0] && args[0] instanceof NumberHolder) {
        args[0].value = this.newType;
      }
      if (args[1] && args[1] instanceof NumberHolder) {
        args[1].value *= this.powerMultiplier;
      }
      return true;
    }

    return false;
  }
}
